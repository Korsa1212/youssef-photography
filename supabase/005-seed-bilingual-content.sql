-- ============================================================
-- Youssef Production — FRESH BILINGUAL CONTENT FOR FAQ & BLOG
-- 
-- HOW: In Supabase Dashboard -> SQL Editor -> New Query -> Paste -> Run
-- 
-- This script:
-- 1. Clears existing FAQ and Blog posts (to remove untranslated / duplicate entries)
-- 2. Inserts 10 complete, professional bilingual FAQs (French + English)
-- 3. Inserts 4 complete, in-depth bilingual Blog posts (French + English)
-- ============================================================


-- 1. Ensure columns exist (just in case 004-bilingual.sql was not run yet)
DO $$ BEGIN
  ALTER TABLE public.faqs ADD COLUMN IF NOT EXISTS question_en text;
  ALTER TABLE public.faqs ADD COLUMN IF NOT EXISTS answer_en text;
  ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS title_en text;
  ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS slug_en text;
  ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS excerpt_en text;
  ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS content_en text;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 2. Clear previous content
DELETE FROM public.faqs;
DELETE FROM public.posts;

-- 3. Insert fresh bilingual FAQs
INSERT INTO public.faqs (question, question_en, answer, answer_en, position, published, created_at) VALUES
  (
    $$Quels types d'événements couvrez-vous ?$$,
    $$What types of events do you cover?$$,
    $$Nous couvrons principalement les mariages, les fiançailles, les renouvellements de vœux ainsi que les événements privés et réceptions à Marrakech et dans tout le Maroc. Chaque reportage est réalisé avec une approche sur mesure.$$,
    $$We primarily cover weddings, engagement sessions, vow renewals, and private celebrations across Marrakech and throughout Morocco. Each story is captured with a personalized and artistic approach.$$,
    1, true, '2026-06-01T09:00:00Z'
  ),
  (
    $$Travaillez-vous uniquement à Marrakech ?$$,
    $$Do you only work in Marrakech?$$,
    $$Nous sommes basés à Marrakech et connaissons parfaitement ses riads, palais, jardins et le désert d'Agafay. Nous nous déplaçons également avec plaisir dans toutes les villes du Maroc (Casablanca, Rabat, Tanger, Essaouira, Fès...) et à l'international.$$,
    $$We are based in Marrakech and know its historic riads, luxury palaces, secret gardens, and the Agafay Desert intimately. We also gladly travel across Morocco (Casablanca, Rabat, Tangier, Essaouira, Fes...) and for destination weddings worldwide.$$,
    2, true, '2026-06-01T09:01:00Z'
  ),
  (
    $$Comment sont calculés vos tarifs ?$$,
    $$How are your packages and rates calculated?$$,
    $$Chaque prestation dépend de la durée de couverture, de la saison, des lieux et des options souhaitées (photo seule, film de mariage ou formule combinée). Envoyez-nous un message sur WhatsApp ou via le formulaire de contact avec votre date pour recevoir un devis personnalisé sous 24h.$$,
    $$Every package is tailored to coverage duration, date, venue location, and whether you desire photography, cinematic film, or both. Send us a message on WhatsApp or through our contact form with your date for a personalized quote within 24 hours.$$,
    3, true, '2026-06-01T09:02:00Z'
  ),
  (
    $$Quand et comment recevons-nous nos photos ?$$,
    $$When and how do we receive our photos?$$,
    $$Vos photos sont livrées en haute définition dans une galerie en ligne privée et sécurisée sous 10 à 15 jours. Vous pouvez facilement les télécharger en pleine résolution et partager l'accès avec vos proches.$$,
    $$Your photographs are delivered in high resolution via a private, secure online gallery within 10 to 15 days. You can easily download full-resolution files and share access with family and friends.$$,
    4, true, '2026-06-01T09:03:00Z'
  ),
  (
    $$Proposez-vous également des reportages vidéo et films de mariage ?$$,
    $$Do you also offer video and cinematic wedding films?$$,
    $$Absolument. Nous réalisons des films de mariage cinématographiques capturant le son direct, l'ambiance et les émotions fortes, ainsi que des teasers verticaux adaptés aux réseaux sociaux (Reels / TikTok).$$,
    $$Absolutely. We craft cinematic wedding films that capture live sound, ambient vibes, and heartfelt moments, alongside modern vertical teasers perfect for sharing on social media (Reels / TikTok).$$,
    5, true, '2026-06-01T09:04:00Z'
  ),
  (
    $$Combien de temps dure un reportage photo ?$$,
    $$How long does your coverage last on the wedding day?$$,
    $$Nos formules s'adaptent à votre programme : de la demi-journée (préparatifs + cérémonie) jusqu'à la journée complète (préparatifs matinaux, cérémonies, cocktail, séance couple et soirée festive).$$,
    $$Our packages adapt flexibly to your schedule: from half-day coverage (getting ready + ceremony) to full-day storytelling (morning preparations, ceremony, cocktail reception, couple portraits, and midnight celebrations).$$,
    6, true, '2026-06-01T09:05:00Z'
  ),
  (
    $$Comment se passe la réservation ?$$,
    $$How does the booking process work?$$,
    $$Après validation de votre devis, la réservation est scellée par un contrat clair et le versement d'un acompte. Votre date est alors garantie et bloquée sur notre calendrier. Le solde est réglé au moment de la prestation.$$,
    $$Once your quote is confirmed, booking is secured with a simple contract and a deposit. Your wedding date is then officially locked on our calendar. The remainder is settled on the event day.$$,
    7, true, '2026-06-01T09:06:00Z'
  ),
  (
    $$Pouvons-nous choisir les lieux pour la séance couple ?$$,
    $$Can we choose the locations for our portrait session?$$,
    $$Tout à fait ! Nous vous conseillons sur les meilleures heures de lumière (Golden Hour) et les décors les plus harmonieux : patio d'un riad historique, palmeraie luxuriante, architecture andalouse ou coucher de soleil dans le désert.$$,
    $$Definitely! We will guide you toward the optimal golden hour lighting and stunning backdrops: historic riad courtyards, lush palm groves, Moorish architecture, or a breathtaking sunset in the desert dunes.$$,
    8, true, '2026-06-01T09:07:00Z'
  ),
  (
    $$Quel est votre style de retouche photo ?$$,
    $$What is your photo editing and retouching style?$$,
    $$Notre style est lumineux, chaleureux et naturel. Nous sublimons chaque image sans filtre artificiel pour que vos souvenirs restent intemporels et fidèles aux émotions vécues.$$,
    $$Our aesthetic is luminous, warm, and authentic. We meticulously colour-grade each image without overdone artificial filters, ensuring your memories remain timeless and true to life.$$,
    9, true, '2026-06-01T09:08:00Z'
  ),
  (
    $$Proposez-vous des séances fiançailles ou pre-wedding ?$$,
    $$Do you offer engagement or pre-wedding sessions?$$,
    $$Oui, c'est une excellente façon de faire connaissance avec l'objectif et de créer de magnifiques souvenirs complices avant le jour du mariage, dans une ambiance détendue et romantique.$$,
    $$Yes, engagement sessions are wonderful for getting comfortable in front of the camera and creating tender, romantic portraits in a relaxed setting before your wedding day.$$,
    10, true, '2026-06-01T09:09:00Z'
  );

-- 4. Insert fresh bilingual Blog Posts
INSERT INTO public.posts (
  title, title_en,
  slug, slug_en,
  excerpt, excerpt_en,
  content, content_en,
  cover_image, published, created_at
) VALUES
  (
    $$10 conseils pour des photos de mariage naturelles et sans stress$$,
    $$10 Tips for Natural and Stress-Free Wedding Photos$$,
    $$10-conseils-photos-naturelles-jour-j$$,
    $$10-tips-natural-wedding-photos$$,
    $$Découvrez nos conseils essentiels pour être détendus devant l'objectif et obtenir des clichés lumineux et spontanés lors de votre mariage à Marrakech.$$,
    $$Discover our essential guidance to feel completely relaxed in front of the lens and capture radiant, spontaneous wedding memories in Marrakech.$$,
    $$Un reportage de mariage réussi ne repose pas sur des poses figées, mais sur la spontanéité et la complicité des mariés.

1. Prévoyez un timing aéré
La première cause de stress est la course contre la montre. Prévoyez toujours 15 à 20 minutes de marge entre les préparatifs, la cérémonie et la réception.

2. Profitez de la lumière dorée (Golden Hour)
À Marrakech, la lumière de fin d'après-midi, environ 45 minutes avant le coucher du soleil, apporte une chaleur incomparable aux portraits de couple.

3. Oubliez l'appareil photo
Regardez-vous, parlez-vous, dansez, marchez ensemble. Votre photographe est là pour capturer vos éclats de rire et vos regards complices en toute discrétion.

4. Choisissez un lieu de préparatifs lumineux
Une chambre spacieuse avec de grandes fenêtres ou un patio de riad permet de créer des images douces et épurées pendant votre mise en beauté.

5. Faites confiance à votre photographe
Laissez-vous guider avec bienveillance. Les plus belles images naissent quand vous vivez pleinement l'instant présent.$$,
    $$A truly memorable wedding album is never about rigid poses, but rather spontaneous emotion and genuine intimacy between the couple.

1. Build breathing room into your timeline
The most common source of wedding day stress is running behind schedule. Always allow 15 to 20 minutes of buffer time between your getting-ready, ceremony, and reception.

2. Embrace the Golden Hour
In Marrakech, late afternoon light—roughly 45 minutes before sunset—casts a magical warm glow over couple portraits that cannot be replicated.

3. Forget the camera is there
Look at each other, talk, laugh, dance, and walk hand in hand. Your photographer is dedicated to capturing candid laughter and tender looks unobtrusively.

4. Pick a luminous preparation setting
A spacious room with generous natural daylight or an open-air riad courtyard creates clean, romantic imagery while you get ready.

5. Trust your photographer
Allow yourself to be gently guided. The most poignant photographs emerge when you are completely immersed in the magic of your celebration.$$,
    $$https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=75$$,
    true, '2026-07-01T10:00:00Z'
  ),
  (
    $$Les plus beaux lieux de Marrakech pour une séance fiançailles ou couple$$,
    $$The Most Beautiful Locations in Marrakech for a Couple Session$$,
    $$seance-fiancailles-lieux-marrakech$$,
    $$best-couple-photo-locations-marrakech$$,
    $$Palais secrets, riads historiques, palmeraie et désert d'Agafay : notre sélection des décors les plus romantiques pour votre séance photo.$$,
    $$Secret palaces, historic riads, lush palm groves, and the Agafay Desert: our curated selection of Marrakech's most romantic backdrops.$$,
    $$Marrakech est l'une des destinations les plus photogéniques au monde. Chaque ruelle et chaque jardin offre une palette de couleurs et d'émotions unique.

1. Les riads traditionnels de la médina
Le charme des zelliges artisanaux, les fontaines en marbre et les patios ombragés créent une atmosphère intimiste et hors du temps.

2. Le désert d'Agafay
À seulement 40 minutes de la ville, les collines minérales et la vue sur l'Atlas offrent un décor grandiose, particulièrement au coucher du soleil sous les teintes dorées et pourpres.

3. La Palmeraie au soleil couchant
Ses palmiers centenaires et ses allées calmes permettent des clichés romantiques empreints de sérénité et d'authenticité.

4. Les jardins luxuriants
Pour des portraits éclatants de verdure, les jardins andalous et les vergers d'orangers apportent fraîcheur et élégance naturelle à votre séance.$$,
    $$Marrakech stands among the most photogenic destinations in the world. Every alleyway and garden offers a unique palette of colours, textures, and moods.

1. Traditional Medina Riads
Handcrafted zellige tilework, marble fountains, and tranquil courtyard gardens provide an intimate, timeless aesthetic for romantic portraiture.

2. The Agafay Desert
Just 40 minutes from the city centre, the rolling stone dunes and backdrop of the Atlas Mountains deliver dramatic, sweeping vistas, especially during sunset.

3. The Palm Grove at Twilight
Centuries-old palm trees and quiet lanes offer peaceful, authentic scenery bathed in soft evening light.

4. Lush Andalusian Gardens
For vivid, sun-dappled greenery, historic Moroccan gardens and orange groves lend effortless elegance and vibrant contrast to your photographs.$$,
    $$https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=75$$,
    true, '2026-07-05T10:00:00Z'
  ),
  (
    $$Photo ou vidéo de mariage : pourquoi combiner les deux pour votre grand jour$$,
    $$Wedding Photo and Video: Why Combining Both Matters for Your Big Day$$,
    $$photo-ou-video-mariage$$,
    $$wedding-photo-and-video-why-combine-both$$,
    $$La photo immortalise l'instant, la vidéo capture les voix et le mouvement. Découvrez pourquoi associer les deux sublime vos souvenirs.$$,
    $$Photography freezes unforgettable moments, while cinematography preserves voices, laughter, and motion. Here is why combining both elevates your memories.$$,
    $$Lorsqu'on prépare son mariage, on se demande souvent s'il faut choisir entre photographie et vidéographie. En réalité, ces deux médiums sont profondément complémentaires.

La force de la photographie
Une photo capte une larme, un regard, un éclat de rire suspendu dans le temps. C'est l'image que vous encadrez dans votre salon et que vous feuilletez dans votre album de famille des années plus tard.

La magie de la vidéo
La vidéo apporte le mouvement, la voix émue lors de l'échange des vœux, la musique de votre première danse et l'énergie débordante de la soirée. Revivre le son et le rythme de cette journée est irremplaçable.

Une équipe coordonnée
En optant pour notre formule combinée photo + vidéo, vous bénéficiez d'une équipe soudée qui travaille en parfaite harmonie, évitant de se gêner mutuellement et capturant chaque moment clé sous tous les angles.$$,
    $$When planning a wedding, couples frequently wonder whether they should choose photography or videography. In truth, these two mediums complement each other beautifully.

The power of photography
A still photograph freezes a tear of joy, a tender glance, and an eruption of laughter in time. It is the artwork framed in your home and cherished across generations.

The magic of cinematic film
Video brings motion, the quiver in your voice during vows, the melodies of your first dance, and the electric atmosphere of the dancefloor. Hearing and watching those emotions in motion is irreplaceable.

Seamless teamwork
By selecting our combined photo and video package, you benefit from a coordinated team working in unison. We anticipate each other's angles, ensuring every pivotal moment is documented harmoniously.$$,
    $$https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=75$$,
    true, '2026-07-10T10:00:00Z'
  ),
  (
    $$Comment bien organiser le timing photo de votre journée de mariage$$,
    $$How to Plan the Perfect Photography Timeline for Your Wedding Day$$,
    $$timing-parfait-photos-mariage$$,
    $$perfect-wedding-photography-timeline$$,
    $$Un guide pratique pour ordonner préparatifs, cérémonies, photos de couple et soirée sans jamais avoir l'impression de courir.$$,
    $$A practical guide to structuring preparations, ceremonies, couple portraits, and celebrations without ever feeling rushed.$$,
    $$Une journée de mariage passe à une vitesse vertigineuse. Un planning photo bien pensé vous permet de profiter de chaque seconde tout en obtenant un reportage complet et serein.

1. Les préparatifs (1h30 à 2h)
Ce moment calme permet de capturer les détails (robe, costume, alliances, parfum) ainsi que les sourires complices avec vos témoins et parents.

2. Le « First Look » (20 à 30 min)
Si vous choisissez de vous découvrir avant la cérémonie, ce rendez-vous intime permet d'évacuer la tension et de vivre une émotion pure en toute intimité.

3. La cérémonie et les félicitations
La priorité est donnée aux émotions spontanées : l'entrée, les échanges de regards, les vœux et la sortie triomphale sous les applaudissements.

4. Les photos de couple (30 à 45 min)
Idéalement programmées en fin de journée pour profiter de la lumière dorée, ces quelques minutes à deux sont souvent l'un des moments préférés des mariés.

5. La soirée et la fête
Place à la spontanéité : dîner aux chandelles, discours, ouverture de bal et festivités capturés sur le vif.$$,
    $$A wedding day flies by in the blink of an eye. A thoughtful photography timeline ensures you savour every moment while receiving a complete, serene collection of memories.

1. Getting Ready (1.5 to 2 hours)
This peaceful morning window allows us to capture heirloom details (dress, rings, perfume, stationery) and heartfelt moments with parents and attendants.

2. The First Look (20 to 30 minutes)
If you choose to reveal yourselves before the ceremony, this intimate encounter releases pre-wedding jitters and creates an emotional, private moment just for the two of you.

3. Ceremony and Congratulations
Here, the focus remains entirely on candid storytelling: the procession, shared glances, vow exchanges, and the joyful recessional.

4. Sunset Couple Portraits (30 to 45 minutes)
Scheduled during golden hour light, this brief pause alone together often becomes one of the couple's favourite memories of the day.

5. The Evening Celebration
Pure spontaneity: candlelit dinners, moving toasts, the first dance, and high-energy festivities documented with lively flair.$$,
    $$https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=75$$,
    true, '2026-07-15T10:00:00Z'
  );
