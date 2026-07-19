import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { email, mobile } = await request.json();

    if (!email && !mobile) {
      return Response.json(
        { error: "Email or Mobile is required" },
        { status: 400 },
      );
    }

    // Find user or create if new
    let user;
    const query = email
      ? sql`SELECT * FROM users WHERE email = ${email}`
      : sql`SELECT * FROM users WHERE mobile = ${mobile}`;

    const users = await query;

    if (users.length === 0) {
      // Create new student
      const [newUser] = await sql`
        INSERT INTO users (role, email, mobile, profile_completed)
        VALUES ('student', ${email || null}, ${mobile || null}, false)
        RETURNING *
      `;
      user = newUser;
    } else {
      user = users[0];
      if (user.role !== "student") {
        return Response.json(
          { error: "Invalid login for this role" },
          { status: 403 },
        );
      }
    }

    // In a real app, we'd send OTP here.
    // For this demo, we'll just return the user as "logged in".
    return Response.json({ user });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Authentication failed" }, { status: 500 });
  }
}
