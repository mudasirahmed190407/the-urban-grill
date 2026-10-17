
export default async (request) => {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body = await request.json();

    // Ignore automated submissions
    if (body.website) {
      return Response.json({ success: true });
    }

    const name = body.name?.trim();
    const phone = body.phone?.trim();

    if (!name || !phone) {
      return Response.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      console.error("Supabase environment variables are missing");
      return Response.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const reservation = {
      request_type: "reservation",
      customer_name: name,
      phone,
      email: body.email || null,
      requested_date: body.date || null,
      requested_time: body.time || null,
      party_size: Number(body.guests) || 2,
      occasion: body.occasion || null,
      notes: body.notes || null,
      status: "pending",
    };

    const response = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/restaurant_requests`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(reservation),
      }
    );

    if (!response.ok) {
      console.error("Supabase insert failed:", response.status);
      return Response.json(
        { error: "Could not save reservation" },
        { status: 500 }
      );
    }

    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Reservation error:", error);
    return Response.json(
      { error: "Could not process reservation" },
      { status: 500 }
    );
  }
};

