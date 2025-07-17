"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { z } from "zod";
import { Separator } from "~/components/ui/separator";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/, "Phone number must be XXX-XXX-XXXX"),
  email: z.string().email("Invalid email address"),
  costGuess: z.preprocess(
    (val) => Number(val),
    z.number().positive("Cost must be positive"),
  ),
  spidrPin: z
    .string()
    .regex(
      /^\d{4}-\d{4}-\d{4}-\d{4}$/,
      "PIN must be 16 digits in ####-####-####-#### format",
    ),
});

export default function HomePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    costGuess: "",
    spidrPin: "",
  });

  const [showPin, setShowPin] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      if (digits.length >= 7) {
        formattedValue = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length >= 4) {
        formattedValue = `${digits.slice(0, 3)}-${digits.slice(3)}`;
      } else {
        formattedValue = digits;
      }
    }

    if (name === "spidrPin") {
      const digits = value.replace(/\D/g, "").slice(0, 16);
      formattedValue = digits
        .replace(/(.{4})/g, "$1-")
        .slice(0, 19)
        .replace(/-$/, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Clear error on change for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    console.log("Validated form data:", result.data);
  };

  return (
    <main className="bg-background flex min-h-screen items-center justify-center p-4 text-white">
      <Card className="w-full max-w-xl rounded-none border-none">
        <CardHeader>
          <CardTitle className="text-text text-2xl">
            Spidr Air Fryer Interest Form
          </CardTitle>
          <Separator />
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="text-text space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ex. Kai"
                aria-describedby="firstName-error"
                className={`rounded-none ${errors.firstName ? "border-red-500" : ""}`}
              />
              {errors.firstName && (
                <p id="firstName-error" className="mt-1 text-sm text-red-500">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="text-text space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Ex. Depweg"
                aria-describedby="lastName-error"
                className={`rounded-none ${errors.lastName ? "border-red-500" : ""}`}
              />
              {errors.lastName && (
                <p id="lastName-error" className="mt-1 text-sm text-red-500">
                  {errors.lastName}
                </p>
              )}
            </div>

            <div className="text-text space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ex. 123-456-7890"
                aria-describedby="phone-error"
                className={`rounded-none ${errors.phone ? "border-red-500" : ""}`}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="text-text space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex. kai@example.com"
                aria-describedby="email-error"
                className={`rounded-none ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="text-text space-y-2">
              <Label htmlFor="costGuess">Guess the Air Fryer’s Cost ($)</Label>
              <Input
                id="costGuess"
                name="costGuess"
                type="number"
                value={formData.costGuess}
                onChange={handleChange}
                placeholder="Ex. 69"
                aria-describedby="costGuess-error"
                className={`rounded-none ${errors.costGuess ? "border-red-500" : ""}`}
              />
              {errors.costGuess && (
                <p id="costGuess-error" className="mt-1 text-sm text-red-500">
                  {errors.costGuess}
                </p>
              )}
            </div>

            <div className="text-text space-y-2">
              <Label htmlFor="spidrPin">
                Very, Very Secret 16-Digit Spidr PIN
              </Label>
              <div className="relative">
                <Input
                  id="spidrPin"
                  name="spidrPin"
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  placeholder="1234-5678-9012-3456"
                  value={formData.spidrPin}
                  onChange={handleChange}
                  className={`rounded-none pr-12 tracking-widest ${errors.spidrPin ? "border-red-500" : ""}`}
                  aria-describedby="spidrPin-error"
                />

                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-text absolute top-1/2 right-2 -translate-y-1/2 transform text-sm text-gray-400 hover:text-gray-200"
                  aria-label={showPin ? "Hide PIN" : "Show PIN"}
                >
                  {showPin ? "Hide" : "Show"}
                </button>
              </div>

              {errors.spidrPin && (
                <p className="mt-1 text-sm text-red-500" id="spidrPin-error">
                  {errors.spidrPin}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="border-foreground bg-background-blue hover:bg-background-blue/80 focus:ring-background-blue rounded-none border px-4 py-2 font-semibold text-white transition-all focus:ring-2 focus:outline-none"
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
