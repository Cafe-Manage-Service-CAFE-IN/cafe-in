import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { CategoryType, MenuType } from '../types/menuMangementType';

export const manufactureCategory = (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
	const list: CategoryType[] = [];
	snapshot.docs.map((doc) => {
		const { id, category, isShowOptionModal } = doc.data();
		list.push({
			id,
			category,
			isShowOptionModal,
		});
	});
	return list;
};

export const manufactureMenuList = (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
	const list: MenuType[] = [];
	snapshot.docs.map((doc) => {
		const { id, name, price, category, soldout, imageUrl, imageName } = doc.data();
		list.push({
			id,
			name,
			price,
			category,
			soldout,
			imageUrl,
			imageName,
		});
	});
	return list;
};
