import sql from "@/app/api/utils/sql";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status, hod_comments, principal_comments, is_urgent } =
      await request.json();

    const [complaint] = await sql`
      UPDATE complaints
      SET 
        status = COALESCE(${status}, status),
        hod_comments = COALESCE(${hod_comments}, hod_comments),
        principal_comments = COALESCE(${principal_comments}, principal_comments),
        is_urgent = COALESCE(${is_urgent}, is_urgent),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!complaint) {
      return Response.json({ error: "Complaint not found" }, { status: 404 });
    }

    return Response.json({ complaint });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const [complaint] = await sql`
      SELECT c.*, u.name as student_name, u.roll_number, u.branch as student_branch
      FROM complaints c
      JOIN users u ON c.student_id = u.id
      WHERE c.id = ${id}
    `;

    if (!complaint) {
      return Response.json({ error: "Complaint not found" }, { status: 404 });
    }

    return Response.json({ complaint });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
