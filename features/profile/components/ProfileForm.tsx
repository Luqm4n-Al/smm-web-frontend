'use client';

import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FiUser, FiMail, FiPhone, FiInstagram, FiKey, FiVideo,
  FiDownload, FiLock, FiArrowLeft, FiSave, FiCamera,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useGetProfileQuery } from '../graphql/get-profile.query';
import { useChangeAvatarMutation } from '../graphql/change-avatar.mutation';
import { useChangePhoneMutation } from '../graphql/change-phone.mutation';
import { useChangeSocialAccountMutation } from '../graphql/change-social-account.mutation';
import type { SocialAccountInput, SocialAccount } from '../graphql/profile.types';

export function ProfileForm() {
  const router = useRouter();
  const { data, loading: profileLoading, error } = useGetProfileQuery();
  const [changeAvatar, { loading: avatarLoading }] = useChangeAvatarMutation();
  const [changePhone, { loading: phoneLoading }] = useChangePhoneMutation();
  const [changeSocial, { loading: socialLoading }] = useChangeSocialAccountMutation();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [apiKey, setApiKey] = useState('');
  const initializedRef = useRef(false);

  // Isi form saat data profil tersedia  
  // This pattern is acceptable: initializing form state once from loaded data
  useEffect(() => {
    if (!data?.me || initializedRef.current) return;
    
    initializedRef.current = true;
    
    // Batch state updates to prevent cascading renders
    flushSync(() => {
      setPhone(data.me.phone);
      setAvatarPreview(data.me.avatar || null);
      
      const insta = (data.me.social_account as SocialAccount[]).find((s) => s.platform === 'instagram');
      const tiktokAcc = (data.me.social_account as SocialAccount[]).find((s) => s.platform === 'tiktok');
      
      if (insta) {
        setInstagram(insta.username || '');
        setApiKey(insta.api_key || '');
      }
      
      if (tiktokAcc) {
        setTiktok(tiktokAcc.username || '');
      }
    });
  }, [data]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }
    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      const result = await changeAvatar({ variables: { file } });
      if (result.data?.changeAvatar) {
        toast.success('Avatar berhasil diubah');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengubah avatar';
      toast.error(errorMessage);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isPhoneLoading = phoneLoading;
    const isSocialLoading = socialLoading;
    if (isPhoneLoading || isSocialLoading) return;

    try {
      // Ubah phone jika berbeda
      if (phone !== data?.me?.phone) {
        await changePhone({ variables: { input: phone } });
        toast.success('Nomor telepon diperbarui');
      }

      // Siapkan input social account
      const socialInput: SocialAccountInput[] = [];
      if (instagram) {
        socialInput.push({ platform: 'instagram', username: instagram, apiKey: apiKey || undefined });
      }
      if (tiktok) {
        socialInput.push({ platform: 'tiktok', username: tiktok });
      }
      await changeSocial({ variables: { input: socialInput } });
      toast.success('Akun media sosial diperbarui');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal menyimpan perubahan';
      toast.error(errorMessage);
    }
  };

  if (profileLoading) return <div>Memuat profil...</div>;
  if (error) return <div>Error memuat profil</div>;

  const inputClass = 'mt-1 block w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500';
  const labelClass = 'block text-sm font-medium text-gray-700';
  const iconClass = 'absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400';

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-600">Kelola informasi akun dan integrasi media sosial Anda.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-5">
          <div className="relative">
            {avatarPreview ? (
              <div className="h-20 w-20 rounded-full overflow-hidden ring-2 ring-blue-100">
                <Image src={avatarPreview} alt="Avatar" width={80} height={80} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center ring-2 ring-blue-100">
                <span className="text-2xl font-bold text-blue-600">
                  {data?.me?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-600 p-1.5 text-white shadow hover:bg-blue-700">
              <FiCamera className="h-3.5 w-3.5" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" disabled={avatarLoading} />
            </label>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Foto Profil</h3>
            <p className="text-xs text-gray-500">Maksimal 2MB. Format JPG, PNG, GIF.</p>
          </div>
        </div>

        {/* Informasi Pribadi */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Informasi Pribadi</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Username</label>
              <div className="relative mt-1">
                <span className={iconClass}><FiUser className="h-4 w-4" /></span>
                <input type="text" value={data?.me?.username || ''} disabled className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <div className="relative mt-1">
                <span className={iconClass}><FiMail className="h-4 w-4" /></span>
                <input type="email" value={data?.me?.email || ''} disabled className={`${inputClass} pl-10`} />
              </div>
              <p className="mt-1 text-xs text-gray-500">Email tidak dapat diubah</p>
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>No. HP</label>
              <div className="relative mt-1">
                <span className={iconClass}><FiPhone className="h-4 w-4" /></span>
                <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={`${inputClass} pl-10`} />
              </div>
            </div>
          </div>
        </div>

        {/* Akun Media Sosial */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Akun Media Sosial</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="instagram" className={labelClass}>Instagram Username</label>
              <div className="relative mt-1">
                <span className={iconClass}><FiInstagram className="h-4 w-4" /></span>
                <input id="instagram" type="text" value={instagram} onChange={e => setInstagram(e.target.value)} className={`${inputClass} pl-10`} placeholder="username_ig" />
              </div>
            </div>
            <div>
              <label htmlFor="apiKey" className={labelClass}>Api Key (Optional)</label>
              <div className="relative mt-1">
                <span className={iconClass}><FiKey className="h-4 w-4" /></span>
                <input id="apiKey" type="text" value={apiKey} onChange={e => setApiKey(e.target.value)} className={`${inputClass} pl-10`} placeholder="Optional" />
              </div>
            </div>
            <div>
              <label htmlFor="tiktok" className={labelClass}>TikTok Username</label>
              <div className="relative mt-1">
                <span className={iconClass}><FiVideo className="h-4 w-4" /></span>
                <input id="tiktok" type="text" value={tiktok} onChange={e => setTiktok(e.target.value)} className={`${inputClass} pl-10`} placeholder="username_tiktok" />
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => toast.success('Laporan sedang disiapkan...')} className="..."><FiDownload /> Download Account Report</button>
            <button type="button" onClick={() => router.push('/change-password')} className="..."><FiLock /> Change Password</button>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => router.push('/dashboard')} className="..."><FiArrowLeft /> Kembali ke Dashboard</button>
            <button type="submit" disabled={phoneLoading || socialLoading} className="... bg-blue-600 text-white ...">
              <FiSave /> {phoneLoading || socialLoading ? 'Menyimpan...' : 'Simpan perubahan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}