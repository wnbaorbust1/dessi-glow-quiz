import QRGenerator from "./QRGenerator";
import { siteConfig } from "@/lib/site-config";

export default function AdminQRPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.canonicalUrl;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl" style={{ color: "#f3e3d5" }}>QR Code Generator</h1>
      <p className="text-sm" style={{ color: "#8a7a6e" }}>
        Generate QR codes for printed materials, in-clinic displays, and marketing collateral.
        All codes point to the Glow Quiz with UTM attribution.
      </p>
      <QRGenerator baseUrl={baseUrl} />
    </div>
  );
}
