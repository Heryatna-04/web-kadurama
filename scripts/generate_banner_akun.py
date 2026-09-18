#!/usr/bin/env python3
"""
Script to generate modern share banner (JPG) for:
DAFTAR AKUN PAMONG & OPERATOR DESA KADURAMA 2026
Style: Modern civic tech share banner with Gemilang Labs developer branding.
"""

import os
from PIL import Image, ImageDraw, ImageFont

def create_banner():
    W, H = 1280, 920
    img = Image.new("RGB", (W, H), (15, 23, 42))  # Deep slate #0f172a
    draw = ImageDraw.Draw(img)

    # Subtle gradient / background accents
    # Gradient overlay from dark emerald-slate to dark slate
    for y in range(H):
        ratio = y / H
        r = int(10 * (1 - ratio) + 15 * ratio)
        g = int(35 * (1 - ratio) + 23 * ratio)
        b = int(30 * (1 - ratio) + 42 * ratio)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # Top accent line
    draw.rectangle([(0, 0), (W, 5)], fill=(0, 147, 136))  # #009388

    # Fonts
    f_reg = "/usr/share/fonts/noto/NotoSans-Regular.ttf"
    f_bold = "/usr/share/fonts/noto/NotoSans-Bold.ttf"
    f_mono = "/usr/share/fonts/noto/NotoSansMono-Regular.ttf"

    font_brand = ImageFont.truetype(f_bold, 13)
    font_badge = ImageFont.truetype(f_bold, 11)
    font_title = ImageFont.truetype(f_bold, 28)
    font_sub = ImageFont.truetype(f_reg, 15)
    font_url = ImageFont.truetype(f_mono, 14)

    font_th = ImageFont.truetype(f_bold, 12)
    font_name = ImageFont.truetype(f_bold, 14)
    font_role = ImageFont.truetype(f_reg, 12)
    font_email = ImageFont.truetype(f_mono, 13)
    font_pwd = ImageFont.truetype(f_mono, 13)
    font_scope = ImageFont.truetype(f_reg, 12)

    font_note_title = ImageFont.truetype(f_bold, 12)
    font_note_body = ImageFont.truetype(f_reg, 12)
    font_footer = ImageFont.truetype(f_reg, 12)
    font_footer_bold = ImageFont.truetype(f_bold, 12)

    margin_x = 55
    content_w = W - (margin_x * 2)  # 1170 px

    # 1. TOP HEADER
    top_y = 35

    # Small Logo Kuningan
    logo_path = "frontend/public/logo-kuningan.png"
    if not os.path.exists(logo_path):
        logo_path = "frontend/public/logo-kuningan-sm.webp"
    
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert("RGBA")
        logo_h = 44
        logo_w = int(logo.size[0] * (logo_h / logo.size[1]))
        logo_res = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
        img.paste(logo_res, (margin_x, top_y), logo_res)
        header_text_x = margin_x + logo_w + 14
    else:
        header_text_x = margin_x

    draw.text((header_text_x, top_y + 4), "PEMERINTAH DESA KADURAMA", fill=(241, 245, 249), font=font_brand)
    draw.text((header_text_x, top_y + 22), "KECAMATAN CIAWIGEBANG, KABUPATEN KUNINGAN", fill=(148, 163, 184), font=font_role)

    # Status Pill on Top Right
    pill_w = 175
    pill_h = 28
    pill_x = W - margin_x - pill_w
    pill_y = top_y + 6
    draw.rounded_rectangle([(pill_x, pill_y), (pill_x + pill_w, pill_y + pill_h)], radius=14, fill=(6, 78, 59), outline=(16, 185, 129))
    draw.text((pill_x + 14, pill_y + 6), "AKUN RESMI AKTIF 2026", fill=(167, 243, 208), font=font_badge)

    # 2. TITLE & ACCESS URL BANNER
    current_y = top_y + 55
    draw.text((margin_x, current_y), "Daftar Akun Pamong & Operator Desa", fill=(255, 255, 255), font=font_title)
    current_y += 38

    # URL Access bar
    bar_h = 40
    draw.rounded_rectangle([(margin_x, current_y), (margin_x + content_w, current_y + bar_h)], radius=8, fill=(30, 41, 59), outline=(51, 65, 85))
    
    draw.text((margin_x + 16, current_y + 11), "Portal Login:", fill=(148, 163, 184), font=font_sub)
    draw.text((margin_x + 112, current_y + 11), "https://kadurama.desa.id/login", fill=(45, 212, 191), font=font_url)
    draw.text((margin_x + 395, current_y + 11), "->  Otomatis Masuk ke Panel Kendali: /master", fill=(226, 232, 240), font=font_sub)

    current_y += bar_h + 20

    # 3. TABEL AKUN (7 AKUN APARATUR - TANPA MASTER)
    col_w = [45, 215, 260, 150, 500]  # Sum = 1170 px
    col_x = [margin_x]
    for w in col_w[:-1]:
        col_x.append(col_x[-1] + w)

    headers = ["NO", "NAMA & JABATAN APARATUR", "EMAIL LOGIN (USER ID)", "KATA SANDI", "WEWENANG & TUGAS SISTEM"]

    # Table Header Row
    th_h = 36
    draw.rounded_rectangle([(margin_x, current_y), (margin_x + content_w, current_y + th_h)], radius=6, fill=(15, 23, 42), outline=(51, 65, 85))
    for i, h_text in enumerate(headers):
        if i == 0 or i == 3:
            bbox = draw.textbbox((0, 0), h_text, font=font_th)
            tx = col_x[i] + (col_w[i] - (bbox[2] - bbox[0])) // 2
        else:
            tx = col_x[i] + 12
        draw.text((tx, current_y + 10), h_text, fill=(148, 163, 184), font=font_th)

    current_y += th_h + 4

    accounts = [
        ("1", "Sumiati, SE", "Sekretaris Desa", "sekdes@kadurama.com", "kadurama2026", "Master data kependudukan, validasi sensus warga, pantau APBDes & warta"),
        ("2", "Trida Sentosa", "Kepala Dusun I Pahing", "kadus.pahing@kadurama.com", "kadurama2026", "Sensus KK Dusun Pahing, verifikasi kelayakan RTLH & setor PBB"),
        ("3", "Andri Rukmana", "Kepala Dusun II Wage", "kadus.wage@kadurama.com", "kadurama2026", "Sensus KK Dusun Wage, verifikasi kelayakan RTLH & setor PBB"),
        ("4", "Jamaludin", "Kepala Dusun III Manis", "kadus.manis@kadurama.com", "kadurama2026", "Sensus KK Dusun Manis, verifikasi kelayakan RTLH & setor PBB"),
        ("5", "Leni Sumiati", "Kaur Keuangan", "keuangan@kadurama.com", "kadurama2026", "Pengelolaan APBDes 2026, pos kegiatan belanja, catat kas & pendapatan"),
        ("6", "Ayub Suhandi", "Kasi Kesejahteraan", "kesra@kadurama.com", "kadurama2026", "Pemantauan penerima bansos (PKH/BPNT) & verifikasi desil miskin ekstrem"),
        ("7", "Operator Balai Desa", "Staf Administrasi", "operator@kadurama.com", "kadurama2026", "Entri sensus & data warga, publikasi berita, pengumuman, & agenda desa"),
    ]

    row_h = 44
    for r_idx, acc in enumerate(accounts):
        ry = current_y + (r_idx * (row_h + 3))
        bg = (30, 41, 59) if r_idx % 2 == 0 else (24, 33, 47)

        # Card container per row
        draw.rounded_rectangle([(margin_x, ry), (margin_x + content_w, ry + row_h)], radius=6, fill=bg, outline=(51, 65, 85))

        # Col 0: No
        no_bbox = draw.textbbox((0, 0), acc[0], font=font_th)
        draw.text((col_x[0] + (col_w[0] - (no_bbox[2] - no_bbox[0])) // 2, ry + 14), acc[0], fill=(148, 163, 184), font=font_th)

        # Col 1: Nama & Jabatan
        draw.text((col_x[1] + 10, ry + 7), acc[1], fill=(255, 255, 255), font=font_name)
        draw.text((col_x[1] + 10, ry + 24), acc[2], fill=(148, 163, 184), font=font_role)

        # Col 2: Email Pill
        epill_w = 265
        epill_h = 26
        epill_x = col_x[2] + 8
        epill_y = ry + 9
        draw.rounded_rectangle([(epill_x, epill_y), (epill_x + epill_w, epill_y + epill_h)], radius=4, fill=(15, 23, 42), outline=(71, 85, 105))
        draw.text((epill_x + 8, epill_y + 5), acc[3], fill=(56, 189, 248), font=font_email)

        # Col 3: Password Green Badge
        pwd_w = 145
        pwd_h = 26
        pwd_x = col_x[3] + (col_w[3] - pwd_w) // 2
        pwd_y = ry + 9
        draw.rounded_rectangle([(pwd_x, pwd_y), (pwd_x + pwd_w, pwd_y + pwd_h)], radius=4, fill=(6, 78, 59), outline=(16, 185, 129))
        p_bbox = draw.textbbox((0, 0), acc[4], font=font_pwd)
        draw.text((pwd_x + (pwd_w - (p_bbox[2] - p_bbox[0])) // 2, pwd_y + 5), acc[4], fill=(167, 243, 208), font=font_pwd)

        # Col 4: Cakupan Wewenang
        draw.text((col_x[4] + 10, ry + 14), acc[5], fill=(203, 213, 225), font=font_scope)

    current_y += len(accounts) * (row_h + 3) + 16

    # 4. KETENTUAN PENGGUNAAN (CARD MINIMALIS)
    box_h = 95
    draw.rounded_rectangle([(margin_x, current_y), (margin_x + content_w, current_y + box_h)], radius=8, fill=(24, 33, 47), outline=(51, 65, 85))
    draw.rounded_rectangle([(margin_x, current_y), (margin_x + 5, current_y + box_h)], radius=3, fill=(0, 147, 136))

    draw.text((margin_x + 20, current_y + 12), "Ketentuan Operasional & Akses Sistem:", fill=(241, 245, 249), font=font_note_title)

    notes = [
        "1. Alamat Akses: Masuk melalui peramban pada halaman /login. Setelah autentikasi berhasil, sistem langsung membuka dashboard /master.",
        "2. Keseragaman Sandi: Seluruh 7 akun pamong telah diseragamkan ke sandi awal kadurama2026. Ganti kata sandi secara mandiri setelah login.",
        "3. Kerahasiaan: Akun hanya untuk aparatur bersangkutan. Setiap perubahan data kependudukan & anggaran terekam di Jejak Audit (Audit Trail)."
    ]
    ny = current_y + 32
    for n in notes:
        draw.text((margin_x + 20, ny), n, fill=(148, 163, 184), font=font_note_body)
        ny += 18

    current_y += box_h + 18

    # 5. FOOTER BRANDING GEMILANG LABS
    draw.line([(margin_x, current_y), (margin_x + content_w, current_y)], fill=(51, 65, 85), width=1)
    current_y += 14

    draw.text((margin_x, current_y), "Tim Pengembang:", fill=(148, 163, 184), font=font_footer)
    draw.text((margin_x + 115, current_y), "Gemilang Labs", fill=(45, 212, 191), font=font_footer_bold)
    draw.text((margin_x + 220, current_y), "•  Sistem Informasi & Transparansi Tata Kelola Desa Kadurama 2026", fill=(148, 163, 184), font=font_footer)

    draw.text((W - margin_x - 220, current_y), "Dokumentasi Penyerahan Akun Resmi", fill=(100, 116, 139), font=font_footer)

    # Save to multiple locations
    output_public = "frontend/public/penyerahan_akun_desa_kadurama.jpg"
    output_root = "penyerahan_akun_desa_kadurama.jpg"
    output_artifact = "/home/jrilym/.gemini/antigravity-cli/brain/a9e07d64-9c66-43c4-865e-48d1d2b47050/penyerahan_akun_desa_kadurama.jpg"

    img.save(output_public, "JPEG", quality=95)
    img.save(output_root, "JPEG", quality=95)
    img.save(output_artifact, "JPEG", quality=95)

    print(f"Generated successfully: {output_public} ({os.path.getsize(output_public)} bytes)")
    print(f"Generated successfully: {output_root} ({os.path.getsize(output_root)} bytes)")
    print(f"Generated successfully: {output_artifact} ({os.path.getsize(output_artifact)} bytes)")

if __name__ == "__main__":
    create_banner()
