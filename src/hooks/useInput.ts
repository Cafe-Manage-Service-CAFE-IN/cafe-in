import { ChangeEvent, useState } from 'react';

export type UnionProp = number | string | boolean | object | File | null;

export type BindMenuType = {
	setValue: (newValue: UnionProp) => void;
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	setObject: <U>(key: string, newValue: U) => void;
};

type UseInputType<T> = [T, BindMenuType, () => void];

function useInput<T extends UnionProp>(initialValue: T): UseInputType<T> {
	const [input, setInput] = useState<T>(initialValue);

	const reset = () => {
		setInput(initialValue);
	};

	const bind = {
		onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			if (typeof input === 'string') {
				setInput(e.target.value as T);
			}
			if (typeof input === 'boolean') {
				const { checked } = e.currentTarget as HTMLInputElement;
				setInput(checked as T);
			}
			if (typeof input === 'object') {
				const { name, value } = e.target;
				setInput({
					...input,
					[name]: value,
				} as T);
			}
		},
		setValue: (newValue: UnionProp) => {
			setInput(newValue as T);
		},
		setObject: <U>(key: string, newValue: U) => {
			if (typeof input === 'object') {
				setInput({
					...input,
					[key]: newValue,
				});
			}
		},
	};

	return [input, bind, reset];
}

export default useInput;
