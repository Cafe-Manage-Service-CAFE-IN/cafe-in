export interface CategoryType {
	id: number;
	category: string;
	isShowOptionModal: boolean;
}

export interface MenuType {
	id: number;
	name: string;
	price: string;
	category: string;
	soldout: boolean;
	imageUrl: string;
	imageName: string;
}
