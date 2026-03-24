// ═══════════════════════════════════════════════════════
// SUPABASE AUTH INTEGRATION GUIDE
// ═══════════════════════════════════════════════════════
//
// The app (src/app.jsx) currently uses React state for auth
// (works for demo/preview). To make it production-ready with
// real persistent auth, apply these changes:
//
// ── STEP 1: Add this import at the top of src/app.jsx ──
//
//   import { supabase } from "./supabaseClient";
//
//
// ── STEP 2: Replace the handleLogin function with: ──
//
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setAuthError("");
//     if (!loginForm.email || !loginForm.password) {
//       setAuthError("Please fill in all fields.");
//       return;
//     }
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email: loginForm.email,
//         password: loginForm.password,
//       });
//       if (error) { setAuthError(error.message); return; }
//       setAuthView("app");
//       // Load user profile
//       const { data: profile } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", data.user.id)
//         .single();
//       if (profile) {
//         setSignupForm(prev => ({
//           ...prev,
//           fullName: profile.full_name,
//           email: profile.email,
//           industry: profile.industry,
//         }));
//       }
//       // Load post history
//       const { data: posts } = await supabase
//         .from("post_history")
//         .select("*")
//         .order("created_at", { ascending: false });
//       if (posts) {
//         setPostHistory(posts.map(p => ({
//           id: p.id,
//           date: new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
//           time: new Date(p.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
//           platform: p.platform,
//           goal: p.goal,
//           original: p.original_draft.slice(0, 120) + (p.original_draft.length > 120 ? "…" : ""),
//           optimized: p.optimized_post || "",
//           suggestionCount: p.suggestion_count,
//         })));
//       }
//     } catch (err) {
//       setAuthError("Login failed. Please try again.");
//     }
//   };
//
//
// ── STEP 3: Replace handleSignupComplete with: ──
//
//   const handleSignupComplete = async (e) => {
//     e.preventDefault();
//     setAuthError("");
//     if (!signupForm.password) { setAuthError("Please create a password."); return; }
//     if (signupForm.password.length < 8) { setAuthError("Password must be at least 8 characters."); return; }
//     if (signupForm.password !== signupForm.confirmPassword) { setAuthError("Passwords do not match."); return; }
//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email: signupForm.email,
//         password: signupForm.password,
//         options: {
//           data: {
//             full_name: signupForm.fullName,
//             phone: signupForm.phone,
//             industry: signupForm.industry,
//           },
//         },
//       });
//       if (error) { setAuthError(error.message); return; }
//       setAuthView("app");
//     } catch (err) {
//       setAuthError("Signup failed. Please try again.");
//     }
//   };
//
//
// ── STEP 4: After setSuggestions(parsed), add Supabase save: ──
//
//   // Save to Supabase
//   const { data: { user } } = await supabase.auth.getUser();
//   if (user) {
//     await supabase.from("post_history").insert({
//       user_id: user.id,
//       platform,
//       goal,
//       original_draft: draft,
//       optimized_post: parsed.find(s => s.severity === "final")?.suggestion || "",
//       suggestions: parsed,
//       suggestion_count: parsed.filter(s => s.severity !== "final").length,
//     });
//   }
//
//
// ── STEP 5: Replace the sign out onClick with: ──
//
//   onClick={async () => {
//     await supabase.auth.signOut();
//     setAuthView("login");
//     setLoginForm({ email: "", password: "" });
//     setSignupForm({ fullName: "", email: "", phone: "", industry: "", password: "", confirmPassword: "" });
//     setSignupStep(1);
//     setPage("optimizer");
//     setSuggestions(null);
//     setDraft("");
//     setPostHistory([]);
//   }}
//
//
// ── STEP 6: Add session check on mount (inside the component): ──
//
//   useEffect(() => {
//     const checkSession = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (session) {
//         setAuthView("app");
//         // Load profile and history (same code as in handleLogin)
//       }
//     };
//     checkSession();
//   }, []);
//
// ═══════════════════════════════════════════════════════
// That's it. Six changes total.
// The rest of the app works as-is.
// ═══════════════════════════════════════════════════════
