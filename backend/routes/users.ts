import { clerkClient } from "@clerk/clerk-sdk-node";

// POST /api/users/info
export const getUsersInfo = async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ error: 'Invalid user IDs' });
    }

    const users = await clerkClient.users.getUserList({
      userId: userIds,
    });

    const simplifiedUsers = users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    }));
    
    res.json(simplifiedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}; 