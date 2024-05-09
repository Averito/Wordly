import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Wordly } from './components/wordly/Wordly.tsx'

export const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/:id' element={<Wordly />} />
			</Routes>
		</BrowserRouter>
	)
}
