import styled from 'styled-components';
import Header from '../../components/MenuManagement/Header';
import CategoryList from '../../components/MenuManagement/CategoryList';
import MenuList from '../../components/MenuManagement/MenuList';
import withAuth from '../../components/adminMode/WithAuth';
import { useFetchWithQuery } from '../../hooks/useFetchWithQuery';

function MenuManagement() {
	useFetchWithQuery('categoryList', 'id');
	useFetchWithQuery('menuItem', 'name');

	return (
		<MenuManagementWrapper>
			<Header />
			<CategoryList />
			<MenuList />
		</MenuManagementWrapper>
	);
}

export default withAuth(MenuManagement);

const MenuManagementWrapper = styled.div`
	user-select: none;
	width: 1194px;
	height: 834px;
	background-color: ${({ theme }) => (theme.lightColor ? '#f9f9f9' : theme.darkColor.background)};
	overflow-y: auto;
	-ms-overflow-style: none;
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
`;
