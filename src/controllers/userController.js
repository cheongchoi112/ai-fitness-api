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
    console.log(`[getUserById] Attempting to find user with ID: ${userId}`);

    try {
      const user = await findUserById(userId);

      if (!user) {
        console.log(`[getUserById] User not found for ID: ${userId}`);
        return res.status(404).json({ error: "User not found" });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      console.log(`[getUserById] Successfully found user: ${userId}`);

      res.json(userWithoutPassword);
    } catch (dbError) {
      console.error(`[getUserById] Database error: ${dbError.message}`);
      console.error(`[getUserById] Stack trace: ${dbError.stack}`);
      if (dbError.name === "BSONTypeError") {
        console.error("[getUserById] Invalid ObjectId format");
        return res.status(400).json({ error: "Invalid user ID format" });
      }
      throw dbError; // Re-throw to be caught by the outer catch block
    }
  } catch (error) {
    console.error(`[getUserById] Unhandled error: ${error.message}`);
    console.error(`[getUserById] Error type: ${error.name}`);
    console.error(`[getUserById] Stack trace: ${error.stack}`);
    console.error(
      `[getUserById] Request params: ${JSON.stringify(req.params)}`
    );
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
