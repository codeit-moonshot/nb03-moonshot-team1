import classNames from 'classnames/bind';
import styles from './page.module.css';
import { acceptMemberInvitation } from '@/app/(main)/invitations/[invitationId]/actions';
import ResultCard from './components/ResultCard';

const cx = classNames.bind(styles);

interface InvitationAcceptPageProps {
    params: Promise<{ invitationId: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const InvitationAcceptPage = async ({ params, searchParams }: InvitationAcceptPageProps) => {
    const { invitationId = 0 } = await params;
    const { token = '' } = await searchParams;
    let isSuccess: boolean | null = false;

    if (token) {
        const acceptResult = await acceptMemberInvitation(Number(invitationId), token as string);
        isSuccess = acceptResult.data;
    }

    return (
        <div className={cx(styles.container)}>
            <div className={cx(styles.header)}>
                <h1 className={cx(styles.title)}>초대 수락</h1>
            </div>
            <div>
                {(token && isSuccess)
                    ? <ResultCard
                        icon='✅'
                        title='수락 완료'
                        desc='프로젝트에 합류했습니다. 프로젝트로 이동해보세요.'
                        btnText='프로젝트로 이동하기'
                        btnLink={`/projects`} />
                    : <ResultCard
                        icon='⚠️'
                        title='잘못된 접근'
                        desc='초대 링크가 만료되었거나 유효하지 않은 주소입니다.'
                        btnText='홈으로 돌아가기'
                        btnLink='/' />}
            </div>
        </div>
    )
}

export default InvitationAcceptPage;
