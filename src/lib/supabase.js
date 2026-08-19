const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const requireConfig = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured.');
  }
};

const headers = (extra = {}) => ({
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
  ...extra
});

const parseError = async (response, fallback) => {
  let details = fallback;
  try {
    const body = await response.json();
    details = body.message || body.error_description || body.error || fallback;
  } catch {}
  const error = new Error(details);
  error.status = response.status;
  throw error;
};

export async function fetchGiftReservations() {
  requireConfig();
  const response = await fetch(
    `${supabaseUrl}/rest/v1/public_gift_reservations?select=gift_id,gift_title,giver_name,created_at&order=created_at.desc`,
    { headers: headers() }
  );
  if (!response.ok) await parseError(response, 'Unable to load gift reservations.');
  return response.json();
}

export async function createGiftReservation({ giftId, giftTitle, giverName, contactNo }) {
  requireConfig();
  const response = await fetch(`${supabaseUrl}/rest/v1/gift_reservations`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify({
      gift_id: giftId,
      gift_title: giftTitle,
      giver_name: giverName,
      contact_no: contactNo || null
    })
  });
  if (!response.ok) await parseError(response, 'Unable to reserve this gift.');
}

export async function fetchGuestPhotos({ offset = 0, limit = 12, eventType = 'all' } = {}) {
  requireConfig();
  const eventFilter = eventType === 'all' ? '' : `&event_type=eq.${encodeURIComponent(eventType)}`;
  const response = await fetch(
    `${supabaseUrl}/rest/v1/guest_photos?select=id,storage_path,public_url,uploader_name,caption,event_type,created_at&order=created_at.desc&offset=${offset}&limit=${limit + 1}${eventFilter}`,
    { headers: headers() }
  );
  if (!response.ok) await parseError(response, 'Unable to load guest photos.');
  const records = await response.json();
  return { records: records.slice(0, limit), hasMore: records.length > limit };
}

export async function uploadGuestPhoto({ file, uploaderName, caption, eventType }) {
  requireConfig();
  const extension = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const uniqueId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const storagePath = `uploads/${new Date().getFullYear()}/${uniqueId}.${extension}`;
  const uploadResponse = await fetch(
    `${supabaseUrl}/storage/v1/object/wedding-guest-photos/${storagePath}`,
    {
      method: 'POST',
      headers: headers({ 'Content-Type': file.type || 'image/jpeg', 'x-upsert': 'false' }),
      body: file
    }
  );
  if (!uploadResponse.ok) await parseError(uploadResponse, 'Unable to upload the photo.');

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/wedding-guest-photos/${storagePath}`;
  const metadataResponse = await fetch(`${supabaseUrl}/rest/v1/guest_photos`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=representation' }),
    body: JSON.stringify({
      storage_path: storagePath,
      public_url: publicUrl,
      uploader_name: uploaderName,
      caption,
      event_type: eventType
    })
  });
  if (!metadataResponse.ok) await parseError(metadataResponse, 'Photo uploaded, but its gallery details could not be saved.');
  const [record] = await metadataResponse.json();
  return record;
}
