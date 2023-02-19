import { QRCodeSVG } from 'qrcode.react';
import { env } from "../../env.mjs";
import Button from "../../ui/Button";

export function RoomQR({ roomId }: { roomId: number }) {
  const QR_DATA = `${env.NEXT_PUBLIC_ORIGIN}/room/${roomId}/review`;

  return (
    <div className="flex flex-col gap-2 place-items-center rounded-md border p-2">
      <QRCodeSVG level="H" value={QR_DATA} />
      <Button>Скачать</Button>
    </div>
  );
}
