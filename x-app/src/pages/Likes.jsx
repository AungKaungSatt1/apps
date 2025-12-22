import { useState, useEffect } from "react";

import { Box, Typography } from "@mui/material";
import UserList from "../components/UserList";

import { fetchPost } from "../libs/fetcher";
import { useParams } from "react-router-dom";

export default function () {
	const { id } = useParams();

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchPost(id).then(data => {
			setUsers(data.likes);
			setLoading(false);
		});
	}, [id]);

	return (
		<Box>
			<Typography
				variant="h4"
				sx={{ textAlign: "center", mb: 2 }}>
				Likes
			</Typography>
			{loading ? <Box>Loading...</Box> : <UserList users={users} />}
		</Box>
	);
}
