import { getStorage, ref as storageRef, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { addToDB, deleteData, getCollection, getDataFromDB, updateData } from '../db';
import { MenuType } from '../../types/menuMangementType';

const menuItemRef = getCollection('menuItem');
const storage = getStorage();

export const storeImage = async (file: File, imageName: string) => {
	const imageRef = storageRef(storage, `images/${imageName}`);
	const snapshot = await uploadBytes(imageRef, file);
	const url = await getDownloadURL(snapshot.ref);
	return url;
};

const removeImg = async (menu: MenuType) => {
	const deleteRef = storageRef(storage, `images/${menu.imageName}`);
	deleteObject(deleteRef)
		.then(() => {
			return true;
		})
		.catch(() => {
			alert('이미지 삭제에 실패했습니다.');
			return;
		});
};

export const addMenu = async (menuInfo: MenuType, imageUrl: string) => {
	await addToDB(menuItemRef, {
		...menuInfo,
		imageUrl: imageUrl,
	});
};

export const updateMenu = async (menuInfo: MenuType, newImageUrl: string) => {
	const { id, name, price, category, imageName, imageUrl, soldout } = menuInfo;
	const menuData = await getDataFromDB(menuItemRef, 'id', id);
	if (menuData.docs.length !== 0) {
		await updateData(menuData.docs[0].ref, {
			id: id.toString(),
			name,
			price,
			category,
			imageName,
			imageUrl: newImageUrl ? newImageUrl : imageUrl,
			soldout,
		});
	}
};

export const deleteMenu = async (menu: MenuType) => {
	const menuData = await getDataFromDB(menuItemRef, 'id', menu.id);
	if (menuData.docs.length !== 0) {
		await removeImg(menu);
		await deleteData(menuData.docs[0].ref);
	}
};
