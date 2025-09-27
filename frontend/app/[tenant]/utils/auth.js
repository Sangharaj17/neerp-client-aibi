export const handleLogout = async (tenant, router, customMessage = null) => {
  try {
    const tokenKey = `${tenant}_token`;
    const storedToken = localStorage.getItem(tokenKey);

    const res = await fetch("http://localhost:8080/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${storedToken}`,
        "X-Tenant": tenant,
      },
    });

    const result = await res.json();

    localStorage.removeItem(`${tenant}_username`);
    localStorage.removeItem(`${tenant}_modules`);
    localStorage.removeItem(`${tenant}_token`);
    localStorage.removeItem(`${tenant}_clientName`);
    localStorage.removeItem(`${tenant}_userEmail`);
    localStorage.removeItem(`${tenant}_clientId`);

    if (res.ok) {
      // Redirect to clean path; middleware resolves tenant
      router.push(`/login`);
    } else {
      toast.error(result.error || "Logout failed!");
    }
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Logout failed due to error");
  }
};
