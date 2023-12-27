import { CategoryType, MenuType } from '../../types/menuMangementType';
export const checkDuplicate = (categoryList: CategoryType[], categoryName: string) => {
	let isDuplicate = false;
	const categoryNameList = categoryList.map((category) => category.category);
	if (categoryNameList.includes(categoryName)) {
		isDuplicate = true;
	}
	return isDuplicate;
};

export const checkDisabled = (id: number, categoryList: CategoryType[], menuList: MenuType[]) => {
	const currentCategory = categoryList.filter((category) => category.id === id)[0];
	const isContain = menuList.some((menu) => menu.category === currentCategory.category);
	return isContain;
};
