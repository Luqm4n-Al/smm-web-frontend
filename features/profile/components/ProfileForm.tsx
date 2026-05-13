// features/profile/components/ProfileForm.tsx
'use client';

import { useRef, useState } from 'react';
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
import { extractErrorMessage } from '@/lib/error-utils';

export function ProfileForm() {
  const router = useRouter();
  const { data, loading: profileLoading, error } = useGetProfileQuery();
  const [changeAvatar, { loading: avatarLoading }] = useChangeAvatarMutation();
  const [changePhone, { loading: phoneLoading }] = useChangePhoneMutation();
  const [changeSocial, { loading: socialLoading }] = useChangeSocialAccountMutation();

  const phoneRef = useRef<HTMLInputElement>(null);
  const instagramRef = useRef<HTMLInputElement>(null);
  const tiktokRef = useRef<HTMLInputElement>(null);
  const apiKeyRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const profile = data?.UserInfo;

  // ✅ Gunakan tipe spesifik SocialAccount[]
  const socialAccounts: SocialAccount[] = profile?.social_account ?? [];
  const instagramAccount = socialAccounts.find(s => s.platform === 'instagram');
  const tiktokAccount = socialAccounts.find(s => s.platform === 'tiktok');

  const defaultPhone = profile?.phone || '';
  const defaultInstagram = instagramAccount?.username || '';
  const defaultTiktok = tiktokAccount?.username || '';
  const defaultApiKey = instagramAccount?.api_key || '';

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);

    try {
      const result = await changeAvatar({ variables: { file } });
      if (result.data?.changeAvatar) {
        toast.success('Avatar berhasil diubah');
      }
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPhone = phoneRef.current?.value || '';
    const newInstagram = instagramRef.current?.value.trim() || '';
    const newTiktok = tiktokRef.current?.value.trim() || '';
    const newApiKey = apiKeyRef.current?.value.trim() || '';

    try {
      if (newPhone !== defaultPhone) {
        await changePhone({ variables: { input: newPhone } });
        toast.success('Nomor telepon diperbarui');
      }

      const socialInput: SocialAccountInput[] = [];
      if (newInstagram) {
        socialInput.push({ platform: 'instagram', username: newInstagram, apiKey: newApiKey || undefined });
      }
      if (newTiktok) {
        socialInput.push({ platform: 'tiktok', username: newTiktok });
      }

      if (socialInput.length > 0) {
        await changeSocial({ variables: { input: socialInput } });
        toast.success('Akun media sosial diperbarui');
      }
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err));
    }
  };

  if (profileLoading) return <div className="flex justify-center py-10 text-gray-500">Memuat profil...</div>;
  if (error) return <div className="flex justify-center py-10 text-red-500">Error: {error.message}</div>;

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
            {avatarPreview || profile?.avatar ? (
              <div className="h-20 w-20 rounded-full overflow-hidden ring-2 ring-blue-100">
                <Image
                  src={avatarPreview || profile?.avatar || ''}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center ring-2 ring-blue-100">
                <span className="text-2xl font-bold text-blue-600">
                  {profile?.username?.charAt(0).toUpperCase()}
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
                <input type="text" value={profile?.username || ''} disabled className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <div className="relative mt-1">
                <span className={iconClass}><FiMail className="h-4 w-4" /></span>
                <input type="email" value={profile?.email || ''} disabled className={`${inputClass} pl-10`} />
              </div>
              <p className="mt-1 text-xs text-gray-500">Email tidak dapat diubah</p>
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>No. HP</label>
              <div className="relative mt-1">
                <span className={iconClass}><FiPhone className="h-4 w-4" /></span>
                <input
                  id="phone"
                  type="tel"
                  defaultValue={defaultPhone}
                  ref={phoneRef}
                  className={`${inputClass} pl-10`}
                />
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
                <input
                  id="instagram"
                  type="text"
                  defaultValue={defaultInstagram}
                  ref={instagramRef}
                  className={`${inputClass} pl-10`}
                  placeholder="username_ig"
                />
              </div>
            </div>
            <div>
              <label htmlFor="apiKey" className={labelClass}>Api Key (Optional)</label>
              <div className="relative mt-1">
                <span className={iconClass}><FiKey className="h-4 w-4" /></span>
                <input
                  id="apiKey"
                  type="text"
                  defaultValue={defaultApiKey}
                  ref={apiKeyRef}
                  className={`${inputClass} pl-10`}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div>
              <label htmlFor="tiktok" className={labelClass}>TikTok Username</label>
              <div className="relative mt-1">
                <span className={iconClass}><FiVideo className="h-4 w-4" /></span>
                <input
                  id="tiktok"
                  type="text"
                  defaultValue={defaultTiktok}
                  ref={tiktokRef}
                  className={`${inputClass} pl-10`}
                  placeholder="username_tiktok"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => toast.success('Laporan sedang disiapkan...')}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <FiDownload className="h-4 w-4" /> Download Account Report
            </button>
            <button
              type="button"
              onClick={() => router.push('/change-password')}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <FiLock className="h-4 w-4" /> Change Password
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <FiArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
            </button>
            <button
              type="submit"
              disabled={phoneLoading || socialLoading}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="h-4 w-4" /> {phoneLoading || socialLoading ? 'Menyimpan...' : 'Simpan perubahan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}