import styles from './ResultCard.module.css';

const ResultCard = ({
  icon, title, desc, btnText, btnLink
}: {
  icon: string;
  title: string;
  desc?: string;
  btnText: string;
  btnLink: string;
}) => {
  return (<>
    <div className={styles.resultCardCard}>
      <div className={styles.resultCardIcon}>{icon}</div>
      <h2 className={styles.resultCardTitle}>{title}</h2>
      {desc && <p className={styles.resultCardDesc}>{desc}</p>}
      <a href={btnLink} className={styles.resultCardBtn}>{btnText}</a>
    </div>
  </>);
}

export default ResultCard;