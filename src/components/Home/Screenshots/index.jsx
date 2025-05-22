import { useGlobal } from "../../Context/GlobalContext";
import ImageWithModal from "../../utils/ImageWithModal";

const Screenshots = () => {
	const { screenshotsList } = useGlobal();

	return (
		<div className="section block all-screenshots">
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
