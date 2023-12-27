import { MenuType } from '../../types/menuMangementType';

export const isValidMenu = (menuInfo: MenuType): boolean => {
	const { name, price, category, imageName } = menuInfo;
	let isValid = true;
	if (name.trim().length === 0 || price.trim().length === 0 || category.trim().length === 0 || !imageName) {
		isValid = false;
	}
	return isValid;
};
