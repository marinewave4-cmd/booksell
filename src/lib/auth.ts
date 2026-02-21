'use client'

import { supabase } from './supabase'

// 회원가입
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (error) throw error
  return data
}

// 로그인
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

// 카카오 로그인
export async function signInWithKakao() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) throw error
  return data
}

// 구글 로그인
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) throw error
  return data
}

// 로그아웃
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// 현재 사용자 가져오기
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 프로필 가져오기
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// 프로필 업데이트
export async function updateProfile(userId: string, updates: {
  name?: string
  bank_name?: string
  bank_account?: string
  account_holder?: string
}) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// 판매자로 전환
export async function becomeSeller(userId: string, bankInfo: {
  bank_name: string
  bank_account: string
  account_holder: string
}) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      role: 'seller',
      ...bankInfo,
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
