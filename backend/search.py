import json
import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def load_products():
    with open("products.json", "r", encoding="utf-8") as f:
        return json.load(f)


def build_context(products):
    return "\n".join(
        f"- ID:{p['id']} | {p['name']} | ₹{p['price']} | {p['category']} | {p['description']}"
        for p in products
    )


def search_products(query):
    products = load_products()
    ctx = build_context(products)

    prompt = f"""You are "Aura", a confident and expert AI Shopping Assistant for "Aura.com".
    You have the COMPLETE product catalog below. This is your ENTIRE inventory.

    PRODUCT CATALOG:
    {ctx}

    RULES:
    - You ARE "Aura". Be confident, friendly, and helpful.
    - NEVER say "I don't have" or "not in catalog" — every product above IS in stock.
    - When a user asks about a product by brand or type (e.g. "Sony headphones", "phone under 20K"), ALWAYS find the closest match from the catalog above and recommend it.
    - For example, if user says "Sony WH-1000XM5", match it to the product named "Sony WH-1000XM5 Headphones" in the catalog.
    - If user asks about a category you have (headphones, earbuds, mouse, keyboard, etc.), show matching products.
    - If user asks for something truly not in the catalog (like "refrigerator"), suggest the closest alternative category you DO have.
    - Give exact prices from the catalog. Never invent prices.
    - Keep responses concise and helpful. No ID numbers in your response text.
    - Redirect inappropriate questions to product topics.
     4. First understand what product the user is asking for.

5. Search the catalog for:
   - Product name
   - Brand name
   - Category
   - Description
   - Similar words (e.g. phone → smartphone, TV → television)

6. If one or more matching products exist:
   - Recommend ONLY those products.
   - Mention their exact price.
   - Explain briefly why they are suitable.
   - Include their IDs in "product_ids".

7. If no matching product exists:
   - Clearly say that Aura does not currently sell that product.
   - Do NOT pretend it exists.
   - If a similar category exists, suggest it.
   - Return an empty product_ids array.

8. If the user greets you (Hi, Hello, Hey, Good Morning, etc.):
   - Reply warmly and naturally.
   - Do not recommend products unless they ask.

10. If the user says Thank you:
   - Reply politely.
11. If the user says Bye:
   - Wish them a good day.
   - Reply naturally and ask how you can help.
   - Answer briefly if appropriate.
   - Then gently redirect them back to shopping.
12  . Never include product IDs in the response text.
    Use IDs only in the "product_ids" array.

13. Always return valid JSON.


    OUTPUT FORMAT — You MUST return valid JSON with exactly these 2 keys:
    1. "response": Your text reply.
    2. "product_ids": Array of integer IDs of products you mention. Use [] if none.

    Example:
    {{
    "response": "The Sony WH-1000XM5 Headphones are available for ₹2,990 — industry-leading noise cancellation with 30hr battery!",
    "product_ids": [1]
    }}

    User question: {query}"""

    try:
        res = client.models.generate_content(
            model="gemini-flash-lite-latest", contents=prompt
        )
        raw = res.text.strip()
        if raw.startswith("```json"):
            raw = raw[7:]
        elif raw.startswith("```"):
            raw = raw[3:]
        if raw.endswith("```"):
            raw = raw[:-3]

        try:
            data = json.loads(raw.strip())
            text = data.get("response", "Here's what I found.")
            ids = data.get("product_ids", [])
            if not isinstance(ids, list):
                ids = []
        except Exception:
            text, ids = raw, []

        matched_ids = []
        for val in ids:
            try:
                matched_ids.append(int(val))
            except (ValueError, TypeError):
                pass

        for p in products:
            p_name = p["name"].lower()
            if p_name in text.lower() or f"id:{p['id']}" in text.lower().replace(
                " ", ""
            ):
                if p["id"] not in matched_ids:
                    matched_ids.append(p["id"])

        matched = [p for p in products if p["id"] in matched_ids]
        return {"success": True, "message": text, "products": matched}

    except Exception as e:
        err = str(e)
        if "429" in err or "RESOURCE_EXHAUSTED" in err:
            msg = "⚠️ Quota exhausted. Please wait a moment and try again."
        else:
            msg = f"Something went wrong: {err}"
        return {"success": False, "message": msg, "products": []}
