"use server";

import { redirect } from "next/navigation";
import { FormState, LoginFormSchema } from "./app/lib/definitions";
import { createSession } from "./app/lib/session";
import * as Types from "./app/types";

const base_url = "https://www.hella.com/webEdiPersistence/";
const headers = {
  securitytoken: process.env.SECURITY_TOKEN,
  "Content-Type": "application/json",
  Accept: "application/json",
};

const formDataToObject = (formData: FormData) => {
  const obj: { [key: string]: string } = {};
  formData.forEach((value, key) => {
    obj[key] = value as string;
  });
  return obj;
};

async function call(endpoint: string) {
  const url = `${base_url}${endpoint}`;
  const res = await fetch(url, {
    headers: headers,
  });

  console.log("response", res);
  if (!res.ok) {
    console.log("request failed");
    return { statusText: res.statusText };
  }
  let data = await res.json();
  console.log(data);
  return data;
}

async function post(endpoint: string, body: string) {
  const url = `${base_url}${endpoint}`;
  const res = await fetch(url, {
    method: "POST",
    body: body,
    headers: headers,
  });

  console.log(res);
  if (!res.ok) {
    return "request failed";
  }
  let data = await res.json();
  return data;
}

async function put(endpoint: string, body: string) {
  const url = `${base_url}${endpoint}`;
  const res = await fetch(url, {
    method: "PUT",
    body: body,
    headers: headers,
  });

  console.log(res);
  if (!res.ok) {
    return "request failed";
  }
  let data = await res.json();
  return data;
}

async function del(endpoint: string) {
  const url = `${base_url}${endpoint}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      SecurityToken: process.env.SECURITY_TOKEN,
    },
  });

  return res.statusText;
}

export async function getAllUsers() {
  return call("users/getAllUsers");
}

export async function getUserById(id: string) {
  return call(`users/getUserById?id=${id}`);
}

export async function getAllClientNumbers() {
  return call("clients/getAllClientNumbers");
}

export async function login(state: FormState, formData: FormData) {
  console.log(formData);
  const user = await authenticateUser(
    formData.get("loginName"),
    formData.get("password"),
  );
  console.log(user);
  if (user && user.id) {
    await createSession(user?.id);
    redirect("/dashboard");
  }
  return user;
}

export async function authenticateUser(loginName: string, password: string) {
  // return {
  //   id: 58,
  //   description: "string",
  //   name: "asdf",
  //   password: "asdfasdf",
  //   loginName: "asdf",
  //   updatedBy: "string",
  //   updatedAt: "2024-11-30",
  //   createdBy: "string",
  //   createdAt: "2024-11-30",
  //   lastLogin: "2024-11-30",
  //   status: 0,
  //   passwordChanged: 0,
  //   passwordChangeable: 0,
  //   passwordValidTo: "2024-11-30",
  //   passwordResetToken: "string",
  //   passwordResetTokenExpiredAt: "2024-11-30",
  //   passwordSalt: "string",
  // };
  const url = `users/authenticateUser?loginName=${loginName}&password=${password}`;
  console.log(url);
  return call(url);
}

export async function createSupplier(formData: FormData) {
  let body: Types.PartialSupplier = formDataToObject(formData);

  console.log(JSON.stringify(body));

  await post("suppliers/createSupplier", JSON.stringify(body));

  redirect("/suppliers");
}

export async function getClientSuppliers(id: string) {
  return call(`suppliers/getSuppliersOfClientWithId?clientId=${id}`);
}

export async function getClientByNumber(number: string) {
  return call(`clients/getClientByNumber?number=${number}`);
}

export async function getAllClients() {
  return call("clients/getAllClients");
}

export async function getAllExistingUserRoles() {
  return call("users/getAllExistingUserRoles");
}

interface NewUserRequestPojo {
  name: string;
  clientNumber: string;
  loginName: string;
  password: string;
}
export async function createUser(formData: FormData) {
  console.log(formData);
  const body = {
    name: formData.get("name"),
    password: formData.get("password"),
    loginName: formData.get("loginName"),
    clientNumber: "1061",
    phone: "string",
    fax: "string",
    mobileNumber: "string",
    email: "string",
  };
  console.log("body", body);
  await insertUser(JSON.stringify(body));
}

export async function insertUser(body: string) {
  return post("users/insertUser", body);
}

export async function deleteUser(id: string) {
  return del(`users/deleteUser?id=${id}`);
}

export async function updateUser(body: string) {
  return put("/users/updateUser", body);
}

export async function getUserGroupsByUserId(id: string) {
  return call(`users/getUserGroupsByUserId?userId=${id}`);
}

export async function getSuppliersWithAdminUserId(id: string) {
  return call(`users/getSuppliersWithAdminUserId?userId=${id}`);
}

export async function getUserDataById(id: string) {
  return call(`users/getUserDataByUserId?userId=${id}`);
}

export async function deleteSupplier(id: string) {
  return del(`suppliers/deleteSupplier?id=${id}`);
}

export async function deleteShipment(id: string) {
  return del(`suppliers/deleteShipment?id=${id}`);
}

export async function insertShipment(formData: FormData) {
  const data = {
    id: formData.get("id"),
  };

  const body = JSON.stringify(data);
  console.log(body);

  await post("shipments/insertShipment", body);
}

export async function fetchShipments() {
  try {
    const response = await fetch("/api/shipments");
    if (!response.ok) {
      throw new Error(`Failed to fetch shipments: ${response.statusText}`);
    }
    const data = await response.json();

    // Předpokládáme, že backend vrací seznam zásilek rozdělených na "pending" a "sent"
    return {
      pending: data.filter((shipment) => shipment.status === "pending"),
      sent: data.filter((shipment) => shipment.status === "sent"),
    };
  } catch (error) {
    console.error(error);
    return { pending: [], sent: [] }; // Pokud dojde k chybě, vrací prázdný seznam
  }
}
