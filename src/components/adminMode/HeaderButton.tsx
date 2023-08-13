import React, { ForwardedRef, forwardRef } from 'react';
import { styled } from 'styled-components';
import { darkTheme } from '../../style/theme';

interface HeaderButtonPropType {
	text: string;
	onClick: () => void;
	decorate?: string;
}
function HeaderButton({ text, onClick, decorate }: HeaderButtonPropType, ref?: ForwardedRef<HTMLButtonElement>) {
	return (
		<Button type="button" ref={ref ? ref : null} className={decorate ? decorate : ''} onClick={onClick}>
			{text}
		</Button>
	);
}

export default forwardRef<HTMLButtonElement, HeaderButtonPropType>(HeaderButton);

const Button = styled.button`
	width: 140px;
	height: 56px;
	border-radius: 10px;
	font-size: ${({ theme }) => theme.fontSize['2xl']};
	font-weight: ${({ theme }) => theme.fontWeight.medium};
	background-color: ${({ theme }) => (theme.lightColor ? theme.textColor.white : darkTheme.darkColor.background)};
	border: ${({ theme }) => (theme.lightColor ? theme.lightColor.point : theme.textColor.darkgray)} 1px solid;
	color: ${({ theme }) => (theme.lightColor ? theme.lightColor.point : theme.textColor.darkgray)};

	&:first-child {
		margin-right: 6px;
	}

	&.is-selected {
		background-color: ${({ theme }) => (theme.lightColor ? theme.lightColor.point : theme.textColor.white)};
		color: ${({ theme }) => (theme.lightColor ? theme.textColor.white : theme.textColor.black)};
	}
`;