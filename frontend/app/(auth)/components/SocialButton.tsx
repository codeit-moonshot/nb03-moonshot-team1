import classNames from 'classnames/bind';
import GoogleImage from '@/public/assets/google.png';
import styles from './SocialButton.module.css';
import Image from 'next/image';

const cx = classNames.bind(styles);

const SocialButton = () => {
  const handleClick = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    // ✅ 백엔드 API 주소로 리다이렉트
    window.location.href = `${BASE_URL}/auth/google`;
  };

  return (
    <div onClick={handleClick} className={cx(styles.socialButton, 'google')} role="button" tabIndex={0}>
      <Image className={cx(styles.socialButtonImage)} src={GoogleImage} alt="google" />
    </div>
  );
};

export default SocialButton;
