"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { signIn, signUp } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { Label, Radio, RadioGroup } from "@heroui/react";

export default function SignupPage() {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("passenger");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        image: form.image,
        role,
      });

      if (error) {
        toast.error(error.message || "Signup failed");
        return;
      }

      toast.success("Account created successfully!");

      setTimeout(() => {
        if (role === "vendor") {
          router.push("/dashboard/vendor");
        } else {
          router.push("/dashboard/passenger");
        }

        router.refresh();
      }, 1000);
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      toast.error("Google sign in failed");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-zinc-950 relative overflow-hidden min-h-screen px-4">

      <div className="absolute w-125 h-125 bg-indigo-600/30 blur-3xl rounded-full top-[-25] left-[-25]" />
      <div className="absolute w-100 h-100 bg-purple-600/20 blur-3xl rounded-full bottom-[-25] right-[-25]" />

      <div className="relative w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center">
          Create Account
        </h1>

        <p className="text-zinc-400 text-center text-sm mt-2">
          Join TicketBari and book your journey
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <div>
            <label className="text-sm text-zinc-400">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full mt-1 p-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Profile Image</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Paste image URL (optional)"
              className="w-full mt-1 p-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="w-full mt-1 p-3 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Password</label>

            <div className="relative mt-1">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full p-3 pr-12 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-indigo-500"
                required
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Label className="text-zinc-400">Role</Label>
            <RadioGroup defaultValue="passenger" name="role" onValueChange={setRole} orientation="horizontal">
              <Radio value="passenger">
                <Radio.Content>
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  Passenger
                </Radio.Content>
              </Radio>
              <Radio value="vendor">
                <Radio.Content>
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  Vendor
                </Radio.Content>
              </Radio>
            </RadioGroup>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-indigo-400 hover:underline"
            >
              Sign In
            </Link>
          </p>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-zinc-500">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center gap-3 text-white font-medium"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

        </form>
      </div >
    </div >
  );
}