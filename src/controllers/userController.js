import {
  createUser,
  findUserByCredentials,
  findUserById,
  updateUser,
  deleteUser,
} from "../services/userService.js";

/**
 * Register a new user
 * @route POST /api/users/signup
 */
export const signup = async (req, res) => {
  try {
    const userData = req.body;

    // Validate required fields
    if (!userData.email || !userData.password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Create user
    const newUser = await createUser(userData);

    // Remove password from response
    const { password, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error in signup:", error);
    if (error.message === "User with this email already exists") {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: "Error creating user" });
  }
};

/**
 * Login user
 * @route POST /api/users/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by credentials
    const user = await findUserByCredentials(email, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Remove password from response
    const { password: userPassword, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

/**
 * Get current user
 * @route GET /api/users/:id
 */
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Error getting user" });
  }
};

/**
 * Update user
 * @route PUT /api/users/:id
 */
export const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const updatedUser = await updateUser(userId, updateData);

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      message: "User updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
};

/**
 * Delete user
 * @route DELETE /api/users/:id
 */
export const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await deleteUser(userId);

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
};
