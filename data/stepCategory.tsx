export const stepsCategory = [
  {
    title: "Informasi Dasar",
    description: "Masukkan informasi dasar kategori",
    fields: ["name", "subName", "brand", "code"] as const,
  },
  {
    title: "Konfigurasi",
    description: "Atur status dan tipe kategori",
    fields: ["status", "type", "isCheckNickname"] as const,
  },
  {
    title: "Konten & Media",
    description: "Upload gambar dan atur konten",
    fields: ["thumbnail", "banner"] as const,
  },
  {
    title: "Detail Tambahan",
    description: "Informasi dan placeholder untuk form",
    fields: [
      "instruction",
      "information",
      "placeholder1",
      "placeholder2",
    ] as const,
  },
];
