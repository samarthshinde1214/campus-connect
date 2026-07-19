import sql from "@/app/api/utils/sql";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId)
    return Response.json({ error: "User ID required" }, { status: 400 });

  const [user] = await sql`SELECT * FROM users WHERE id = ${userId}`;
  return Response.json({ user });
}

export async function PATCH(request) {
  try {
    const { id, name, mobile, email, branch, year, roll_number } =
      await request.json();

    if (!id)
      return Response.json({ error: "User ID required" }, { status: 400 });

    const [updatedUser] = await sql`
      UPDATE users 
      SET 
        name = COALESCE(${name}, name),
        mobile = COALESCE(${mobile}, mobile),
        email = COALESCE(${email}, email),
        branch = COALESCE(${branch}, branch),
        year = COALESCE(${year}, year),
        roll_number = COALESCE(${roll_number}, roll_number),
        profile_completed = true
      WHERE id = ${id}
      RETURNING *
    `;

    return Response.json({ user: updatedUser });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
