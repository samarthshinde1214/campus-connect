import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const users =
      await sql`SELECT * FROM users WHERE email = ${email} AND password = ${password}`;

    if (users.length === 0) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = users[0];
    if (user.role === "student") {
      return Response.json(
        { error: "Students should use OTP login" },
        { status: 403 },
      );
    }

    return Response.json({ user });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}

// Optional: Seeding staff if they don't exist
export async function GET() {
  try {
    const staff = [
      {
        email: "principal@campusconnect.edu",
        role: "principal",
        name: "Dr. Principal",
        password: "admin",
      },
      {
        email: "hod_it@campusconnect.edu",
        role: "hod",
        branch: "IT",
        name: "Prof. Sharma",
        password: "admin",
      },
      {
        email: "hod_entc@campusconnect.edu",
        role: "hod",
        branch: "ENTC",
        name: "Prof. Gupta",
        password: "admin",
      },
      {
        email: "hod_elec@campusconnect.edu",
        role: "hod",
        branch: "Electrical",
        name: "Prof. Patil",
        password: "admin",
      },
      {
        email: "hod_mech@campusconnect.edu",
        role: "hod",
        branch: "Mechanical",
        name: "Prof. Deshmukh",
        password: "admin",
      },
      {
        email: "hod_civil@campusconnect.edu",
        role: "hod",
        branch: "Civil",
        name: "Prof. Kulkarni",
        password: "admin",
      },
      {
        email: "hod_mca@campusconnect.edu",
        role: "hod",
        branch: "MCA",
        name: "Prof. Joshi",
        password: "admin",
      },
    ];

    for (const s of staff) {
      await sql`
        INSERT INTO users (email, role, name, branch, password, profile_completed)
        VALUES (${s.email}, ${s.role}, ${s.name}, ${s.branch || null}, ${s.password}, true)
        ON CONFLICT (email) DO NOTHING
      `;
    }
    return Response.json({ success: true, message: "Staff seeded" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
