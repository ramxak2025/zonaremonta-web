import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  services, about, contact, works,
  type ServicesContent, type AboutContent, type ContactContent, type Work,
} from '@/lib/content';
import { isAdmin } from '@/lib/admin-auth';

/**
 * Универсальный сохраняющий endpoint.
 * POST /api/admin/save  { kind: 'services' | 'about' | 'contact' | 'works', data: ... }
 * Защищён middleware'ом /api/admin/*.
 */

const KitSchema = z.object({
  id: z.string().min(1),
  badge: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(['mpi', 'di']),
  cylinders: z.enum(['4', '6', '8']).optional(),
  forWho: z.string().min(1),
  brands: z.string().min(1),
  priceFrom: z.number().int().nonnegative(),
  features: z.array(z.string()),
  featured: z.boolean().optional(),
});

const ServicesSchema = z.object({
  installKits: z.array(KitSchema),
  repairServices: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      text: z.string().min(1),
      priceFrom: z.number().int().nonnegative(),
      durationMin: z.number().int().nonnegative(),
    }),
  ),
});

const AboutSchema = z.object({
  foundedYear: z.number().int(),
  totalInstalls: z.number().int().nonnegative(),
  yearsExperience: z.number().int().nonnegative(),
  story: z.string().min(1),
  philosophy: z.string().min(1),
  details: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })),
});

const ContactSchema = z.object({
  phone: z.string().min(1),
  whatsappNumber: z.string().min(1),
  maxLink: z.string().url(),
  yandexMapsLink: z.string().url(),
  address: z.string().min(1),
  workingHours: z.string().min(1),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
});

const WorkSchema = z.object({
  id: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int(),
  engine: z.string().min(1),
  type: z.enum(['mpi', 'gdi', 'combined']),
  equipment: z.string().min(1),
  price: z.number().int().nonnegative(),
  date: z.string().min(1),
  cover: z.string().min(1),
  process: z.array(z.object({ src: z.string().min(1), caption: z.string().min(1) })),
});

const Body = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('services'), data: ServicesSchema }),
  z.object({ kind: z.literal('about'),    data: AboutSchema }),
  z.object({ kind: z.literal('contact'),  data: ContactSchema }),
  z.object({ kind: z.literal('works'),    data: z.array(WorkSchema) }),
]);

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.format() }, { status: 400 });
  }

  switch (parsed.data.kind) {
    case 'services': await services.write(parsed.data.data as ServicesContent); break;
    case 'about':    await about.write(parsed.data.data as AboutContent);       break;
    case 'contact':  await contact.write(parsed.data.data as ContactContent);   break;
    case 'works':    await works.write(parsed.data.data as Work[]);             break;
  }

  return NextResponse.json({ ok: true });
}
