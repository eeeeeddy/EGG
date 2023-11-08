import React, { createContext, useState, useContext, useEffect } from 'react';

export function useUser() {
	return useContext(UserContext);
}
const initialUserState = {
	user: '',
	userEmail: '',
	selectedPapers: [],
	history: [],
	setUser: () => { },
	updateEmail: () => { },
	updateSelectedPapers: () => { },
	updateHistory: () => { },
};
const UserContext = createContext(initialUserState);

export function UserProvider({ children, prevEmail }) {
	const [user, setUser] = useState(null);
	const [userEmail, setUserEmail] = useState("");
	const [selectedPapers, setSelectedPapers] = useState([]);
	const [history, setHistory] = useState([]);
	const [accessToken, setAccessToken] = useState(null); // Add a state for the access token
	console.log(prevEmail);

	useEffect(() => {
		const unsubscribe = ((user) => {
			if (user) {
				// 로그인한 사용자가 있다면 이메일 가져오기
				setUserEmail(user.email || ''); // 로그인한 사용자의 이메일을 가져와 userEmail 상태 업데이트
			} else {
				// 로그인한 사용자가 없다면 이메일 빈 문자열로 설정
				setUserEmail('');
			}
		});
		return () => {
			// 컴포넌트가 언마운트될 때 이벤트 리스너 정리
			unsubscribe();
		};
	}, []); // 이펙트는 한 번만 실행
	const updateUser = (newUser) => {
		setUser(newUser);
	};
	const updateEmail = (email) => {
		setUserEmail(email);
	};
	const updateSelectedPapers = (papers) => {
		setSelectedPapers(papers);
	};
	const updateHistory = (historyItem) => {
		console.log('Updating history with:', historyItem);
		setHistory((prevHistory) => [...prevHistory, historyItem]);
	};
	const updateAccessToken = (token) => {
		setAccessToken(token);
	};

	return (
		<UserContext.Provider
			value={{
				user,
				userEmail,
				selectedPapers,
				history,
				accessToken,
				setUser: updateUser,
				updateEmail,
				updateSelectedPapers,
				updateHistory,
				updateAccessToken,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}
export default UserProvider;