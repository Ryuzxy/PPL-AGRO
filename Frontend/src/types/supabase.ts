export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artikel: {
        Row: {
          created_at: string | null
          gambar_url: string | null
          id: number
          isi: string
          judul: string
          kategori: string | null
          penulis: string | null
          ringkasan: string | null
          tanggal_terbit: string | null
        }
        Insert: {
          created_at?: string | null
          gambar_url?: string | null
          id?: number
          isi: string
          judul: string
          kategori?: string | null
          penulis?: string | null
          ringkasan?: string | null
          tanggal_terbit?: string | null
        }
        Update: {
          created_at?: string | null
          gambar_url?: string | null
          id?: number
          isi?: string
          judul?: string
          kategori?: string | null
          penulis?: string | null
          ringkasan?: string | null
          tanggal_terbit?: string | null
        }
        Relationships: []
      }
      formula_pakan_harian: {
        Row: {
          ampas_tahu_kg: number | null
          catatan: string | null
          created_at: string | null
          estimasi_biaya_harian: number | null
          estimasi_omzet_harian: number | null
          id: number
          indigofera_kg: number | null
          konsentrat_kg: number | null
          margin_iofc_harian: number | null
          mineral_premix_gram: number | null
          nama_skenario: string | null
          rasio_fc: string | null
          rumput_odot_kg: number | null
          sapi_id: number | null
          silase_jagung_kg: number | null
          status_penerapan: string | null
          tanggal_berlaku: string | null
        }
        Insert: {
          ampas_tahu_kg?: number | null
          catatan?: string | null
          created_at?: string | null
          estimasi_biaya_harian?: number | null
          estimasi_omzet_harian?: number | null
          id?: number
          indigofera_kg?: number | null
          konsentrat_kg?: number | null
          margin_iofc_harian?: number | null
          mineral_premix_gram?: number | null
          nama_skenario?: string | null
          rasio_fc?: string | null
          rumput_odot_kg?: number | null
          sapi_id?: number | null
          silase_jagung_kg?: number | null
          status_penerapan?: string | null
          tanggal_berlaku?: string | null
        }
        Update: {
          ampas_tahu_kg?: number | null
          catatan?: string | null
          created_at?: string | null
          estimasi_biaya_harian?: number | null
          estimasi_omzet_harian?: number | null
          id?: number
          indigofera_kg?: number | null
          konsentrat_kg?: number | null
          margin_iofc_harian?: number | null
          mineral_premix_gram?: number | null
          nama_skenario?: string | null
          rasio_fc?: string | null
          rumput_odot_kg?: number | null
          sapi_id?: number | null
          silase_jagung_kg?: number | null
          status_penerapan?: string | null
          tanggal_berlaku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "formula_pakan_harian_sapi_id_fkey"
            columns: ["sapi_id"]
            isOneToOne: false
            referencedRelation: "sapi"
            referencedColumns: ["id"]
          }
        ]
      }
      foto_sapi: {
        Row: {
          created_at: string | null
          id: number
          jarak_cm: number | null
          keterangan: string | null
          kuartir: string | null
          lux: number | null
          sapi_id: number | null
          suhu_permukaan: number | null
          url_foto: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          jarak_cm?: number | null
          keterangan?: string | null
          kuartir?: string | null
          lux?: number | null
          sapi_id?: number | null
          suhu_permukaan?: number | null
          url_foto: string
        }
        Update: {
          created_at?: string | null
          id?: number
          jarak_cm?: number | null
          keterangan?: string | null
          kuartir?: string | null
          lux?: number | null
          sapi_id?: number | null
          suhu_permukaan?: number | null
          url_foto?: string
        }
        Relationships: [
          {
            foreignKeyName: "foto_sapi_sapi_id_fkey"
            columns: ["sapi_id"]
            isOneToOne: false
            referencedRelation: "sapi"
            referencedColumns: ["id"]
          }
        ]
      }
      hasil_deteksi_mastitis: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          detail_kuartir: Json | null
          foto_id: number | null
          grade: string | null
          id: number
          indeks_eritema: number | null
          model_engine: string | null
          rekomendasi_sop: string | null
          sapi_id: number | null
          status_deteksi: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          detail_kuartir?: Json | null
          foto_id?: number | null
          grade?: string | null
          id?: number
          indeks_eritema?: number | null
          model_engine?: string | null
          rekomendasi_sop?: string | null
          sapi_id?: number | null
          status_deteksi?: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          detail_kuartir?: Json | null
          foto_id?: number | null
          grade?: string | null
          id?: number
          indeks_eritema?: number | null
          model_engine?: string | null
          rekomendasi_sop?: string | null
          sapi_id?: number | null
          status_deteksi?: string
        }
        Relationships: [
          {
            foreignKeyName: "hasil_deteksi_mastitis_foto_id_fkey"
            columns: ["foto_id"]
            isOneToOne: false
            referencedRelation: "foto_sapi"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hasil_deteksi_mastitis_sapi_id_fkey"
            columns: ["sapi_id"]
            isOneToOne: false
            referencedRelation: "sapi"
            referencedColumns: ["id"]
          }
        ]
      }
      histori_produksi_susu: {
        Row: {
          catatan: string | null
          clotting: boolean | null
          created_at: string | null
          id: number
          jumlah_liter: number
          konduktivitas: number | null
          kualitas_grade: string | null
          operator: string | null
          ph_susu: number | null
          sapi_id: number | null
          scc: number | null
          sesi: string | null
          suhu_susu: number | null
          tanggal: string | null
        }
        Insert: {
          catatan?: string | null
          clotting?: boolean | null
          created_at?: string | null
          id?: number
          jumlah_liter: number
          konduktivitas?: number | null
          kualitas_grade?: string | null
          operator?: string | null
          ph_susu?: number | null
          sapi_id?: number | null
          scc?: number | null
          sesi?: string | null
          suhu_susu?: number | null
          tanggal?: string | null
        }
        Update: {
          catatan?: string | null
          clotting?: boolean | null
          created_at?: string | null
          id?: number
          jumlah_liter?: number
          konduktivitas?: number | null
          kualitas_grade?: string | null
          operator?: string | null
          ph_susu?: number | null
          sapi_id?: number | null
          scc?: number | null
          sesi?: string | null
          suhu_susu?: number | null
          tanggal?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "histori_produksi_susu_sapi_id_fkey"
            columns: ["sapi_id"]
            isOneToOne: false
            referencedRelation: "sapi"
            referencedColumns: ["id"]
          }
        ]
      }
      pakan: {
        Row: {
          created_at: string | null
          harga_per_kg: number
          id: number
          jenis_pakan: string | null
          kadar_ndf_pct: number | null
          kadar_protein_kasar_pct: number | null
          nama_pakan: string
          satuan: string | null
          stok_kg: number | null
          sumber: string | null
        }
        Insert: {
          created_at?: string | null
          harga_per_kg: number
          id?: number
          jenis_pakan?: string | null
          kadar_ndf_pct?: number | null
          kadar_protein_kasar_pct?: number | null
          nama_pakan: string
          satuan?: string | null
          stok_kg?: number | null
          sumber?: string | null
        }
        Update: {
          created_at?: string | null
          harga_per_kg?: number
          id?: number
          jenis_pakan?: string | null
          kadar_ndf_pct?: number | null
          kadar_protein_kasar_pct?: number | null
          nama_pakan?: string
          satuan?: string | null
          stok_kg?: number | null
          sumber?: string | null
        }
        Relationships: []
      }
      pemasukan: {
        Row: {
          created_at: string | null
          id: number
          jumlah: number
          kategori: string | null
          keterangan: string | null
          nomor_rekap_wa: string | null
          produk_id: number | null
          sapi_id: number | null
          tanggal: string | null
          volume_liter: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          jumlah: number
          kategori?: string | null
          keterangan?: string | null
          nomor_rekap_wa?: string | null
          produk_id?: number | null
          sapi_id?: number | null
          tanggal?: string | null
          volume_liter?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          jumlah?: number
          kategori?: string | null
          keterangan?: string | null
          nomor_rekap_wa?: string | null
          produk_id?: number | null
          sapi_id?: number | null
          tanggal?: string | null
          volume_liter?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pemasukan_produk_id_fkey"
            columns: ["produk_id"]
            isOneToOne: false
            referencedRelation: "produk"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pemasukan_sapi_id_fkey"
            columns: ["sapi_id"]
            isOneToOne: false
            referencedRelation: "sapi"
            referencedColumns: ["id"]
          }
        ]
      }
      pengeluaran: {
        Row: {
          bukti_transaksi_url: string | null
          created_at: string | null
          id: number
          jumlah: number
          kategori: string | null
          keterangan: string | null
          pakan_id: number | null
          sapi_id: number | null
          tanggal: string | null
        }
        Insert: {
          bukti_transaksi_url?: string | null
          created_at?: string | null
          id?: number
          jumlah: number
          kategori?: string | null
          keterangan?: string | null
          pakan_id?: number | null
          sapi_id?: number | null
          tanggal?: string | null
        }
        Update: {
          bukti_transaksi_url?: string | null
          created_at?: string | null
          id?: number
          jumlah?: number
          kategori?: string | null
          keterangan?: string | null
          pakan_id?: number | null
          sapi_id?: number | null
          tanggal?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pengeluaran_pakan_id_fkey"
            columns: ["pakan_id"]
            isOneToOne: false
            referencedRelation: "pakan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pengeluaran_sapi_id_fkey"
            columns: ["sapi_id"]
            isOneToOne: false
            referencedRelation: "sapi"
            referencedColumns: ["id"]
          }
        ]
      }
      prediksi_siklus_laktasi: {
        Row: {
          created_at: string | null
          dim: number | null
          estimasi_harian_liter: number | null
          estimasi_omzet_siklus: number | null
          estimasi_total_siklus_liter: number | null
          fitur_input: Json | null
          id: number
          peak_day: number | null
          persistensi_pct: number | null
          sapi_id: number | null
          tanggal_prediksi: string | null
          target_peak_liter: number | null
        }
        Insert: {
          created_at?: string | null
          dim?: number | null
          estimasi_harian_liter?: number | null
          estimasi_omzet_siklus?: number | null
          estimasi_total_siklus_liter?: number | null
          fitur_input?: Json | null
          id?: number
          peak_day?: number | null
          persistensi_pct?: number | null
          sapi_id?: number | null
          tanggal_prediksi?: string | null
          target_peak_liter?: number | null
        }
        Update: {
          created_at?: string | null
          dim?: number | null
          estimasi_harian_liter?: number | null
          estimasi_omzet_siklus?: number | null
          estimasi_total_siklus_liter?: number | null
          fitur_input?: Json | null
          id?: number
          peak_day?: number | null
          persistensi_pct?: number | null
          sapi_id?: number | null
          tanggal_prediksi?: string | null
          target_peak_liter?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prediksi_siklus_laktasi_sapi_id_fkey"
            columns: ["sapi_id"]
            isOneToOne: false
            referencedRelation: "sapi"
            referencedColumns: ["id"]
          }
        ]
      }
      produk: {
        Row: {
          created_at: string | null
          harga_satuan: number
          id: number
          jenis_produk: string | null
          nama_produk: string
          satuan: string | null
          stok_tersedia: number | null
        }
        Insert: {
          created_at?: string | null
          harga_satuan: number
          id?: number
          jenis_produk?: string | null
          nama_produk: string
          satuan?: string | null
          stok_tersedia?: number | null
        }
        Update: {
          created_at?: string | null
          harga_satuan?: number
          id?: number
          jenis_produk?: string | null
          nama_produk?: string
          satuan?: string | null
          stok_tersedia?: number | null
        }
        Relationships: []
      }
      sapi: {
        Row: {
          berat_badan: number | null
          catatan: string | null
          created_at: string | null
          eartag: string
          fase_laktasi: string | null
          foto_profil_url: string | null
          id: number
          jenis_kelamin: string | null
          lokasi_kandang: string | null
          nama: string
          ras: string | null
          rerata_produksi_harian: number | null
          skor_bcs: number | null
          status_kesehatan: string | null
          tanggal_lahir: string | null
          tanggal_melahirkan: string | null
          updated_at: string | null
        }
        Insert: {
          berat_badan?: number | null
          catatan?: string | null
          created_at?: string | null
          eartag: string
          fase_laktasi?: string | null
          foto_profil_url?: string | null
          id?: number
          jenis_kelamin?: string | null
          lokasi_kandang?: string | null
          nama: string
          ras?: string | null
          rerata_produksi_harian?: number | null
          skor_bcs?: number | null
          status_kesehatan?: string | null
          tanggal_lahir?: string | null
          tanggal_melahirkan?: string | null
          updated_at?: string | null
        }
        Update: {
          berat_badan?: number | null
          catatan?: string | null
          created_at?: string | null
          eartag?: string
          fase_laktasi?: string | null
          foto_profil_url?: string | null
          id?: number
          jenis_kelamin?: string | null
          lokasi_kandang?: string | null
          nama?: string
          ras?: string | null
          rerata_produksi_harian?: number | null
          skor_bcs?: number | null
          status_kesehatan?: string | null
          tanggal_lahir?: string | null
          tanggal_melahirkan?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
