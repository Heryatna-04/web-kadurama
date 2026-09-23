#!/usr/bin/env python3
"""
Script to generate high-resolution official document image (JPG) for:
BERITA ACARA SERAH TERIMA AKUN & HAK AKSES SISTEM INFORMASI DESA KADURAMA
(Catatan: Akun master@kadurama.com tidak diikutsertakan).
"""

import os
from PIL import Image, ImageDraw, ImageFont

def create_document_image():
    W, H = 1654, 2338  # Standard A4 at 200 DPI
    img = Image.new("RGB", (W, H), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Fonts
    font_path_regular = "/usr/share/fonts/noto/NotoSans-Regular.ttf"
    font_path_bold = "/usr/share/fonts/noto/NotoSans-Bold.ttf"
    font_path_mono = "/usr/share/fonts/noto/NotoSansMono-Regular.ttf"

    font_kop_1 = ImageFont.truetype(font_path_bold, 24)
    font_kop_2 = ImageFont.truetype(font_path_bold, 26)
    font_kop_3 = ImageFont.truetype(font_path_bold, 33)
    font_kop_sub = ImageFont.truetype(font_path_regular, 16)

    font_title = ImageFont.truetype(font_path_bold, 24)
    font_subtitle = ImageFont.truetype(font_path_bold, 19)
    font_number = ImageFont.truetype(font_path_mono, 16)

    font_body = ImageFont.truetype(font_path_regular, 17)
    font_body_bold = ImageFont.truetype(font_path_bold, 17)

    font_th = ImageFont.truetype(font_path_bold, 15)
    font_td = ImageFont.truetype(font_path_regular, 15)
    font_td_bold = ImageFont.truetype(font_path_bold, 15)
    font_td_mono = ImageFont.truetype(font_path_mono, 14)
    font_td_small = ImageFont.truetype(font_path_regular, 13)

    font_note_title = ImageFont.truetype(font_path_bold, 15)
    font_note_body = ImageFont.truetype(font_path_regular, 14)

    font_sig_role = ImageFont.truetype(font_path_bold, 16)
    font_sig_title = ImageFont.truetype(font_path_regular, 14)
    font_sig_name = ImageFont.truetype(font_path_bold, 16)
    font_sig_nip = ImageFont.truetype(font_path_regular, 13)

    margin_left = 110
    margin_right = 110
    content_width = W - margin_left - margin_right

    current_y = 75

    # 1. LOGO KUNINGAN
    logo_path = "frontend/public/logo-kuningan.png"
    if not os.path.exists(logo_path):
        logo_path = "frontend/public/logo-kuningan-sm.webp"
    
    if os.path.exists(logo_path):
        logo_img = Image.open(logo_path).convert("RGBA")
        # Resize maintaining aspect ratio
        orig_w, orig_h = logo_img.size
        target_h = 135
        target_w = int(orig_w * (target_h / orig_h))
        logo_resized = logo_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        img.paste(logo_resized, (margin_left + 15, current_y), logo_resized)

    # 2. KOP SURAT TEXT
    kop_x = margin_left + 140
    kop_width = content_width - 140
    kop_center_x = kop_x + (kop_width // 2)

    # Text 1: PEMERINTAH KABUPATEN KUNINGAN
    t1 = "PEMERINTAH KABUPATEN KUNINGAN"
    bbox1 = draw.textbbox((0, 0), t1, font=font_kop_1)
    draw.text((kop_center_x - (bbox1[2] - bbox1[0]) // 2, current_y), t1, fill=(30, 41, 59), font=font_kop_1)
    current_y += 33

    # Text 2: KECAMATAN CIAWIGEBANG
    t2 = "KECAMATAN CIAWIGEBANG"
    bbox2 = draw.textbbox((0, 0), t2, font=font_kop_2)
    draw.text((kop_center_x - (bbox2[2] - bbox2[0]) // 2, current_y), t2, fill=(15, 23, 42), font=font_kop_2)
    current_y += 34

    # Text 3: PEMERINTAH DESA KADURAMA
    t3 = "PEMERINTAH DESA KADURAMA"
    bbox3 = draw.textbbox((0, 0), t3, font=font_kop_3)
    draw.text((kop_center_x - (bbox3[2] - bbox3[0]) // 2, current_y), t3, fill=(0, 0, 0), font=font_kop_3)
    current_y += 42

    # Text 4: Alamat
    t4 = "Jalan Raya Kadurama No. 01 Kecamatan Ciawigebang Kabupaten Kuningan Kode Pos 45591"
    bbox4 = draw.textbbox((0, 0), t4, font=font_kop_sub)
    draw.text((kop_center_x - (bbox4[2] - bbox4[0]) // 2, current_y), t4, fill=(71, 85, 105), font=font_kop_sub)
    current_y += 24

    # Text 5: Web & Email
    t5 = "Website: https://kadurama.desa.id   •   Surel: pemdes@kadurama.desa.id"
    bbox5 = draw.textbbox((0, 0), t5, font=font_kop_sub)
    draw.text((kop_center_x - (bbox5[2] - bbox5[0]) // 2, current_y), t5, fill=(71, 85, 105), font=font_kop_sub)
    current_y += 38

    # 3. KOP DIVIDER (Double line)
    draw.line([(margin_left, current_y), (W - margin_right, current_y)], fill=(0, 0, 0), width=4)
    current_y += 6
    draw.line([(margin_left, current_y), (W - margin_right, current_y)], fill=(0, 0, 0), width=1)
    current_y += 30

    # 4. JUDUL DOKUMEN
    title_center_x = margin_left + (content_width // 2)

    t_doc = "BERITA ACARA SERAH TERIMA AKUN & HAK AKSES"
    bbox_tdoc = draw.textbbox((0, 0), t_doc, font=font_title)
    tdoc_w = bbox_tdoc[2] - bbox_tdoc[0]
    tdoc_x = title_center_x - tdoc_w // 2
    draw.text((tdoc_x, current_y), t_doc, fill=(15, 23, 42), font=font_title)
    # Underline
    draw.line([(tdoc_x, current_y + 30), (tdoc_x + tdoc_w, current_y + 30)], fill=(15, 23, 42), width=2)
    current_y += 38

    t_sub = "SISTEM INFORMASI PELAYANAN & TRANSPARANSI DESA KADURAMA"
    bbox_sub = draw.textbbox((0, 0), t_sub, font=font_subtitle)
    draw.text((title_center_x - (bbox_sub[2] - bbox_sub[0]) // 2, current_y), t_sub, fill=(51, 65, 85), font=font_subtitle)
    current_y += 28

    t_nomor = "Nomor: 005 / BAST-TI / KDR / IX / 2026"
    bbox_nomor = draw.textbbox((0, 0), t_nomor, font=font_number)
    draw.text((title_center_x - (bbox_nomor[2] - bbox_nomor[0]) // 2, current_y), t_nomor, fill=(71, 85, 105), font=font_number)
    current_y += 34

    # 5. PENGANTAR (Intro text)
    intro_lines = [
        "Pada hari ini, Jumat tanggal Delapan Belas bulan September tahun Dua Ribu Dua Puluh Enam (18-09-2026), bertempat di Kantor Balai Desa",
        "Kadurama, telah diserahkan kredensial akun akses operasional Sistem Informasi Desa Kadurama dari Tim Pengembang Teknis kepada Aparatur",
        "Pemerintah Desa Kadurama dengan rincian peruntukan jabatan dan hak akses sistem sebagai berikut:"
    ]
    for line in intro_lines:
        draw.text((margin_left, current_y), line, fill=(30, 41, 59), font=font_body)
        current_y += 25

    current_y += 12

    # 6. TABEL AKUN (7 AKUN PAMONG - MASTER TIDAK IKUT)
    col_widths = [55, 235, 245, 285, 175, 439]  # Sum = 1434 = content_width
    col_x = [margin_left]
    for w in col_widths[:-1]:
        col_x.append(col_x[-1] + w)

    table_headers = [
        "No",
        "Nama Aparatur",
        "Jabatan Kedinasan",
        "Email Akses (ID Login)",
        "Kata Sandi",
        "Cakupan Wewenang Sistem"
    ]

    accounts = [
        (
            "1",
            "Sumiati, SE",
            "Sekretaris Desa",
            "sekdes@kadurama.com",
            "kadurama2026",
            "Loket persuratan warga, verifikasi pengajuan, dan master data desa"
        ),
        (
            "2",
            "Trida Sentosa",
            "Kepala Dusun I Pahing",
            "kadus.pahing@kadurama.com",
            "kadurama2026",
            "Sensus KK, kelayakan RTLH & monitoring PBB Dusun Pahing"
        ),
        (
            "3",
            "Andri Rukmana",
            "Kepala Dusun II Wage",
            "kadus.wage@kadurama.com",
            "kadurama2026",
            "Sensus KK, kelayakan RTLH & monitoring PBB Dusun Wage"
        ),
        (
            "4",
            "Jamaludin",
            "Kepala Dusun III Manis",
            "kadus.manis@kadurama.com",
            "kadurama2026",
            "Sensus KK, kelayakan RTLH & monitoring PBB Dusun Manis"
        ),
        (
            "5",
            "Leni Sumiati",
            "Kaur Keuangan",
            "keuangan@kadurama.com",
            "kadurama2026",
            "Pencatatan realisasi kas APBDes 2026, pos kegiatan, & pendapatan"
        ),
        (
            "6",
            "Ayub Suhandi",
            "Kasi Kesejahteraan",
            "kesra@kadurama.com",
            "kadurama2026",
            "Pemantauan penerima bansos & verifikasi desil miskin ekstrem"
        ),
        (
            "7",
            "Operator Balai Desa",
            "Staf Administrasi",
            "operator@kadurama.com",
            "kadurama2026",
            "Entri pelayanan harian, publikasi berita, pengumuman, & agenda"
        ),
    ]

    # Draw Table Header
    header_h = 44
    draw.rectangle(
        [(margin_left, current_y), (margin_left + content_width, current_y + header_h)],
        fill=(15, 23, 42)
    )

    for i, th in enumerate(table_headers):
        if i == 0 or i == 4:  # Center align for No & Sandi
            bbox = draw.textbbox((0, 0), th, font=font_th)
            tx = col_x[i] + (col_widths[i] - (bbox[2] - bbox[0])) // 2
        else:
            tx = col_x[i] + 10
        ty = current_y + (header_h - 18) // 2
        draw.text((tx, ty), th, fill=(255, 255, 255), font=font_th)

    current_y += header_h

    # Draw Table Rows
    row_h = 46
    for r_idx, acc in enumerate(accounts):
        bg_color = (255, 255, 255) if r_idx % 2 == 0 else (248, 250, 252)
        row_y = current_y + (r_idx * row_h)

        # Background
        draw.rectangle(
            [(margin_left, row_y), (margin_left + content_width, row_y + row_h)],
            fill=bg_color,
            outline=(203, 213, 225),
            width=1
        )

        # Col 0: No (Center)
        no_bbox = draw.textbbox((0, 0), acc[0], font=font_td)
        draw.text(
            (col_x[0] + (col_widths[0] - (no_bbox[2] - no_bbox[0])) // 2, row_y + 14),
            acc[0],
            fill=(71, 85, 105),
            font=font_td
        )

        # Col 1: Nama (Bold)
        draw.text((col_x[1] + 10, row_y + 14), acc[1], fill=(15, 23, 42), font=font_td_bold)

        # Col 2: Jabatan
        draw.text((col_x[2] + 10, row_y + 14), acc[2], fill=(51, 65, 85), font=font_td)

        # Col 3: Email (Badge Monospace)
        email_pill_w = 265
        email_pill_h = 28
        pill_x = col_x[3] + 8
        pill_y = row_y + 9
        draw.rounded_rectangle(
            [(pill_x, pill_y), (pill_x + email_pill_w, pill_y + email_pill_h)],
            radius=4,
            fill=(241, 245, 249),
            outline=(226, 232, 240)
        )
        draw.text((pill_x + 8, pill_y + 5), acc[3], fill=(15, 23, 42), font=font_td_mono)

        # Col 4: Password (Green Badge)
        pwd_badge_w = 145
        pwd_badge_h = 28
        pwd_x = col_x[4] + (col_widths[4] - pwd_badge_w) // 2
        pwd_y = row_y + 9
        draw.rounded_rectangle(
            [(pwd_x, pwd_y), (pwd_x + pwd_badge_w, pwd_y + pwd_badge_h)],
            radius=4,
            fill=(236, 253, 245),
            outline=(167, 243, 208)
        )
        pwd_bbox = draw.textbbox((0, 0), acc[4], font=font_td_mono)
        draw.text(
            (pwd_x + (pwd_badge_w - (pwd_bbox[2] - pwd_bbox[0])) // 2, pwd_y + 5),
            acc[4],
            fill=(4, 120, 87),
            font=font_td_mono
        )

        # Col 5: Cakupan Wewenang (Small, clean)
        draw.text((col_x[5] + 10, row_y + 14), acc[5], fill=(71, 85, 105), font=font_td_small)

        # Column borders
        for x_line in col_x:
            draw.line([(x_line, row_y), (x_line, row_y + row_h)], fill=(203, 213, 225), width=1)
        draw.line([(margin_left + content_width, row_y), (margin_left + content_width, row_y + row_h)], fill=(203, 213, 225), width=1)

    current_y += len(accounts) * row_h + 20

    # 7. KETENTUAN KEAMANAN & SOP (NOTE BOX)
    box_h = 160
    draw.rounded_rectangle(
        [(margin_left, current_y), (margin_left + content_width, current_y + box_h)],
        radius=6,
        fill=(248, 250, 252),
        outline=(226, 232, 240),
        width=1
    )
    # Left accent bar
    draw.rounded_rectangle(
        [(margin_left, current_y), (margin_left + 6, current_y + box_h)],
        radius=3,
        fill=(0, 147, 136)
    )

    box_text_y = current_y + 14
    draw.text(
        (margin_left + 22, box_text_y),
        "Ketentuan Penggunaan & Standar Operasional Prosedur (SOP) Akses:",
        fill=(15, 23, 42),
        font=font_note_title
    )
    box_text_y += 28

    notes = [
        ("• Portal Akses Masuk:", " Masuk panel admin melalui peramban pada alamat resmi https://kadurama.desa.id/login."),
        ("• Keseragaman Sandi:", " Seluruh 7 akun aparatur telah diseragamkan dengan kata sandi default awal: kadurama2026."),
        ("• Pergantian Sandi Mandiri:", " Pejabat bersangkutan dianjurkan memperbarui kata sandi secara mandiri setelah serah terima."),
        ("• Perlindungan Akses:", " Dilarang membagikan kredensial ke pihak luar. Seluruh aktivitas terekam otomatis pada Jejak Audit.")
    ]

    for label, desc in notes:
        draw.text((margin_left + 24, box_text_y), label, fill=(15, 23, 42), font=font_body_bold)
        lbl_bbox = draw.textbbox((0, 0), label, font=font_body_bold)
        draw.text((margin_left + 24 + (lbl_bbox[2] - lbl_bbox[0]), box_text_y), desc, fill=(71, 85, 105), font=font_note_body)
        box_text_y += 25

    current_y += box_h + 30

    # 8. TANDA TANGAN (SIGNATURES)
    sig_col_w = content_width // 2

    # Pihak Pertama (Kiri)
    p1_center_x = margin_left + (sig_col_w // 2)
    p1_role = "PIHAK PERTAMA"
    p1_title = "Yang Menyerahkan (Tim Pengembang Sistem)"
    b_p1_r = draw.textbbox((0, 0), p1_role, font=font_sig_role)
    b_p1_t = draw.textbbox((0, 0), p1_title, font=font_sig_title)
    draw.text((p1_center_x - (b_p1_r[2] - b_p1_r[0]) // 2, current_y), p1_role, fill=(15, 23, 42), font=font_sig_role)
    draw.text((p1_center_x - (b_p1_t[2] - b_p1_t[0]) // 2, current_y + 22), p1_title, fill=(71, 85, 105), font=font_sig_title)

    # Pihak Kedua (Kanan)
    p2_center_x = margin_left + sig_col_w + (sig_col_w // 2)
    p2_role = "PIHAK KEDUA"
    p2_title = "Yang Menerima (Pemerintah Desa Kadurama)"
    b_p2_r = draw.textbbox((0, 0), p2_role, font=font_sig_role)
    b_p2_t = draw.textbbox((0, 0), p2_title, font=font_sig_title)
    draw.text((p2_center_x - (b_p2_r[2] - b_p2_r[0]) // 2, current_y), p2_role, fill=(15, 23, 42), font=font_sig_role)
    draw.text((p2_center_x - (b_p2_t[2] - b_p2_t[0]) // 2, current_y + 22), p2_title, fill=(71, 85, 105), font=font_sig_title)

    # Sign space
    sig_y = current_y + 115

    # Nama Pihak Pertama
    p1_name = "Tim Teknis / Pengembang Sistem"
    p1_sub = "Sistem Informasi Desa Kadurama"
    b_n1 = draw.textbbox((0, 0), p1_name, font=font_sig_name)
    b_s1 = draw.textbbox((0, 0), p1_sub, font=font_sig_nip)
    n1_x = p1_center_x - (b_n1[2] - b_n1[0]) // 2
    draw.text((n1_x, sig_y), p1_name, fill=(15, 23, 42), font=font_sig_name)
    draw.line([(n1_x, sig_y + 22), (n1_x + (b_n1[2] - b_n1[0]), sig_y + 22)], fill=(15, 23, 42), width=1)
    draw.text((p1_center_x - (b_s1[2] - b_s1[0]) // 2, sig_y + 26), p1_sub, fill=(100, 116, 139), font=font_sig_nip)

    # Nama Pihak Kedua
    p2_name = "Sumiati, SE"
    p2_sub = "Sekretaris Desa Kadurama"
    b_n2 = draw.textbbox((0, 0), p2_name, font=font_sig_name)
    b_s2 = draw.textbbox((0, 0), p2_sub, font=font_sig_nip)
    n2_x = p2_center_x - (b_n2[2] - b_n2[0]) // 2
    draw.text((n2_x, sig_y), p2_name, fill=(15, 23, 42), font=font_sig_name)
    draw.line([(n2_x, sig_y + 22), (n2_x + (b_n2[2] - b_n2[0]), sig_y + 22)], fill=(15, 23, 42), width=1)
    draw.text((p2_center_x - (b_s2[2] - b_s2[0]) // 2, sig_y + 26), p2_sub, fill=(100, 116, 139), font=font_sig_nip)

    # Mengetahui (Center bottom)
    sig_y += 65
    m_title = "Mengetahui,"
    m_role = "KEPALA DESA KADURAMA"
    b_mt = draw.textbbox((0, 0), m_title, font=font_sig_title)
    b_mr = draw.textbbox((0, 0), m_role, font=font_sig_role)
    draw.text((title_center_x - (b_mt[2] - b_mt[0]) // 2, sig_y), m_title, fill=(71, 85, 105), font=font_sig_title)
    draw.text((title_center_x - (b_mr[2] - b_mr[0]) // 2, sig_y + 20), m_role, fill=(15, 23, 42), font=font_sig_role)

    sig_y += 105
    m_name = "( ............................................ )"
    m_sub = "Kepala Desa Kadurama"
    b_mn = draw.textbbox((0, 0), m_name, font=font_sig_name)
    b_ms = draw.textbbox((0, 0), m_sub, font=font_sig_nip)
    draw.text((title_center_x - (b_mn[2] - b_mn[0]) // 2, sig_y), m_name, fill=(15, 23, 42), font=font_sig_name)
    draw.text((title_center_x - (b_ms[2] - b_ms[0]) // 2, sig_y + 24), m_sub, fill=(100, 116, 139), font=font_sig_nip)

    # Output paths
    output_public = "frontend/public/penyerahan_akun_desa_kadurama.jpg"
    output_root = "penyerahan_akun_desa_kadurama.jpg"
    output_artifact = "/home/jrilym/.gemini/antigravity-cli/brain/a9e07d64-9c66-43c4-865e-48d1d2b47050/penyerahan_akun_desa_kadurama.jpg"

    img.save(output_public, "JPEG", quality=95)
    img.save(output_root, "JPEG", quality=95)
    img.save(output_artifact, "JPEG", quality=95)

    print(f"Successfully generated {output_public} ({os.path.getsize(output_public)} bytes)")
    print(f"Successfully generated {output_root} ({os.path.getsize(output_root)} bytes)")
    print(f"Successfully generated {output_artifact} ({os.path.getsize(output_artifact)} bytes)")

if __name__ == "__main__":
    create_document_image()
