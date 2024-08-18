import { createContext, FC, ReactNode, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export type Cell = {
	position: number;
	color: string;
};

export type GridContextType = {
	updateCell: (position: number, color: string) => void;
	initialGrid: Cell[];
	gridChanges: Cell[];
};

export const GridContext = createContext<GridContextType>({} as GridContextType);

export type GridProviderProps = {
	children?: ReactNode;
}

export const GridProvider: FC<GridProviderProps> = ({ children }) => {
	const [socket, setSocket] = useState<Socket
	| null>(null);
	const [initialGrid, setInitialGrid] = useState<Cell[]>([]);
	const [gridChanges, setGridChanges] = useState<Cell[]>([]);

	const updateCell = (position: number, color: string) => {
		const cell = {
			position: position,
			color,
		};
		
		console.log('Emiting update cell ', cell);
		socket?.emit('update-cell', cell);
	};

	useEffect(() => {
		const socket = io('http://localhost:3000');

		socket.on('connect', () => {
			console.log('Connected to grid artist server');
			setSocket(socket);
		});

		socket.on('initial-grid', (initialGrid: Cell[]) => {
			console.log(initialGrid);
			setInitialGrid(initialGrid);
		});

		socket.on('grid-changes', (cells: Cell[]) => {
			setGridChanges(cells);
		});
		
		socket.on('disconnect', () => {
			console.log('Disconnected from grid artist server');
			setSocket(null);
		});

		return () => {
			socket.close();
			setSocket(null);
		}
	}, []);

	return (
		<GridContext.Provider value={{
			updateCell,
			initialGrid,
			gridChanges,
		}}>
			{children}
		</GridContext.Provider>
	);
}
