import { useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { manufactureCategory, manufactureMenuList } from '../utils/manufactureSnapshot';
import { useSetRecoilState } from 'recoil';
import { categoryListState, selectedCategoryState } from '../state/CategoryList';
import { menuListState } from '../state/MenuListState';

export function useFetchWithQuery(collectionName: string, condition: string) {
	const setCategoryList = useSetRecoilState(categoryListState);
	const setMenuList = useSetRecoilState(menuListState);
	const setSelectedCategory = useSetRecoilState(selectedCategoryState);

	useEffect(() => {
		const fetchData = async () => {
			const collectionRef = collection(db, collectionName);
			const unsub = onSnapshot(query(collectionRef, orderBy(condition)), (snapshot) => {
				if (collectionName === 'categoryList') {
					const manufacturedCategory = manufactureCategory(snapshot);
					setCategoryList(manufacturedCategory);
					setSelectedCategory(manufacturedCategory[0].category);
				}
				if (collectionName === 'menuItem') {
					const manufacturedMenuList = manufactureMenuList(snapshot);
					setMenuList(manufacturedMenuList);
				}
			});
			return unsub;
		};
		fetchData();
	}, [collectionName, condition]);
}
