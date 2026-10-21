/*
  Tetapan sambungan Google untuk selaras data antara peranti.

  CLIENT_ID ialah OAuth Client ID dari Google Cloud (APIs & Services > Credentials).
  Projek Google Cloud untuk apps peribadi (akaun fa.rawyadal@gmail.com), berasingan
  daripada projek kerja Read My Mail. Projek itu perlu: Google Drive API dihidupkan,
  skop drive.appdata, dan https://farawyadal.github.io dalam Authorized JavaScript origins.
  Client ID bukan rahsia; selamat diletak dalam repo public.

  MyBajet hanya minta kebenaran drive.appdata: baca dan tulis fail dalam folder
  tersembunyi khas apps ini dalam Google Drive. Ia tak boleh nampak fail lain dalam Drive.
*/
window.MYBAJET_CONFIG = {
  CLIENT_ID: '955576045843-541si1cs87t9apl0r5muk5nui00obps1.apps.googleusercontent.com',
};
