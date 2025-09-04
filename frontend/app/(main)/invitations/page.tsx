import { redirect } from 'next/navigation';

export default function InvitationsIndex() {
  redirect('/projects'); // 307 Temporary Redirect
}