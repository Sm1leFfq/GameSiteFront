import { useGlobal } from "../../Context/GlobalContext";
import ImageWithModal from "../../utils/ImageWithModal";

import styles from "./style.module.scss";

const Screenshots = () => {
	const { screenshotsList } = useGlobal();

	return (
		<div className={styles.root}>
			<h2>Последние скриншоты</h2>
			<div className="screenshots">
				{screenshotsList
					?.sort()
					?.slice(0, 4)
					?.map((scrn, idx) => (
						<ImageWithModal
							key={"scrn" + idx}
							src={scrn.url}
							alt={"Скриншот " + idx}
						/>
					))}
			</div>
		</div>
	);
};

export default Screenshots;
