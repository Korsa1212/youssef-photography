-- ============================================================
-- Youssef Production — SAMPLE / TEST CONTENT
-- Run this ONCE in: Supabase Dashboard -> SQL Editor -> New query -> Run
-- It inserts: 10 FAQ, 4 blog posts, 12 approved reviews.
-- (Running it twice duplicates FAQ + reviews; posts are safe via on conflict.)
-- ============================================================

-- ---------- FAQ ----------
insert into public.faqs (question, answer, position, published, created_at) values
  ($$Quels types d'événements couvrez-vous ?$$,
   $$Nous couvrons principalement les mariages, les fiançailles et les événements privés au Maroc : réceptions, fêtes, cérémonies et anniversaires. Chaque projet est unique, contactez-nous pour en parler.$$,
   1, true, '2026-06-01T09:00:00Z'),
  ($$Travaillez-vous uniquement à Marrakech ?$$,
   $$Nous sommes basés à Marrakech et couvrons toute la ville ainsi que ses environs. Nous nous déplaçons également dans d'autres villes du Maroc sur demande, selon l'événement.$$,
   2, true, '2026-06-01T09:01:00Z'),
  ($$Comment sont calculés vos tarifs ?$$,
   $$Chaque prestation est personnalisée : durée du reportage, nombre de photographes, pack photo, vidéo ou les deux. Envoyez-nous un message sur WhatsApp avec la date et le lieu de votre événement : vous recevrez un devis gratuit sous 24 heures.$$,
   3, true, '2026-06-01T09:02:00Z'),
  ($$Quand recevons-nous nos photos ?$$,
   $$Vous recevez une galerie privée en haute définition quelques jours après l'événement. Les photos sont sélectionnées puis retouchées avec soin, sans délai artificiel.$$,
   4, true, '2026-06-01T09:03:00Z'),
  ($$Proposez-vous aussi la vidéo ?$$,
   $$Oui, en plus de la photo nous proposons des reportages vidéo et des films de mariage. Les formules combinées photo + vidéo permettent de bénéficier d'un tarif préférentiel.$$,
   5, true, '2026-06-01T09:04:00Z'),
  ($$Combien de temps dure un reportage ?$$,
   $$Nos formules s'étendent de la demi-journée (préparatifs + cérémonie) à la journée complète (préparatifs, cérémonie, séance couple et soirée). Nous adaptons la durée à votre programme.$$,
   6, true, '2026-06-01T09:05:00Z'),
  ($$Comment se passe la réservation ?$$,
   $$Pour réserver votre date, un acompte et un contrat simple suffisent. La date est alors bloquée et confirmée. Le solde est réglé avant ou le jour de votre événement, selon ce qui vous arrange.$$,
   7, true, '2026-06-01T09:06:00Z'),
  ($$Pouvons-nous choisir les lieux des photos ?$$,
   $$Bien sûr. Lors d'un repérage préalable, nous définissons ensemble les lieux qui correspondent à vos envies : riad, jardin, palmeraie, plage ou désert.$$,
   8, true, '2026-06-01T09:07:00Z'),
  ($$Les photos sont-elles retouchées ?$$,
   $$Oui, chaque cliché livré est sélectionné et retouché : cadrage, lumière et couleurs, tout en restant naturel et fidèle au moment vécu.$$,
   9, true, '2026-06-01T09:08:00Z'),
  ($$Proposez-vous des séances fiançailles ?$$,
   $$Oui, c'est l'une de nos prestations préférées. Une séance d'une heure à une heure trente dans un lieu choisi ensemble, idéale pour préparer le grand jour tout en gardant un souvenir tendre de cette période.$$,
   10, true, '2026-06-01T09:09:00Z');

-- ---------- BLOG POSTS ----------
insert into public.posts (title, slug, excerpt, content, cover_image, published, created_at) values
  ($$Comment préparer son reportage de mariage à Marrakech$$,
   $$comment-preparer-reportage-mariage-marrakech$$,
   $$Mariage, timing, lieux, tenue : le guide complet pour que vos photos soient à la hauteur du plus beau jour de votre vie.$$,
   $$Un reportage de mariage réussi ne doit rien au hasard. Quelques semaines avant le grand jour, prenez le temps de préparer chaque étape avec votre photographe : c'est la clé pour des images à la hauteur du plus beau jour de votre vie.

Commencez par définir un timing réaliste. Laissez au moins une heure pour les préparatifs, trente à quarante-cinq minutes pour la séance couple, et anticipez les temps de déplacement. Un programme trop serré se traduit toujours par des photos expédiées.

Le choix des lieux compte autant que la lumière. À Marrakech, privilégiez les riads avec patios lumineux tôt le matin ou en fin d'après-midi, et les jardins comme la Majorelle pour des portraits colorés. Votre photographe peut vous guider lors d'un repérage.

Enfin, parlez-nous de votre histoire. Les plus belles images naissent des détails qui vous ressemblent : un bijou de famille, une lettre échangée, une coutume propre à votre région. C'est ce petit supplément d'âme qui rend un reportage unique.

Le jour J, faites confiance à votre photographe et restez présents l'un à l'autre. Les photos les plus émouvantes sont celles où l'on vous voit vivre, et non poser.$$,
   $$https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=75$$,
   true, '2026-07-03T10:00:00Z'),
  ($$Séance fiançailles : huit idées de lieux inoubliables à Marrakech$$,
   $$seance-fiancailles-lieux-marrakech$$,
   $$Riads, Jardins Majorelle, palmeraie, désert d'Agafay : où organiser votre séance fiançailles à Marrakech pour des photos magiques ?$$,
   $$La séance fiançailles est devenue un incontournable : elle fige cette période unique où tout commence, et vous permet de vous entraîner devant l'objectif bien avant le grand jour. Le plus dur reste de choisir le décor.

Le Jardin Majorelle et ses bleus électriques offrent un contraste saisissant qui fonctionne à merveille en toute saison. Comptez une petite heure, de préférence à l'ouverture pour éviter la foule.

Les riads privatisés restent la valeur sûre : patios en zellige, fontaines, lumière douce filtrée par les arches. On y obtient des images élégantes et intimes, très demandées par nos clients.

Pour les amoureux de grands espaces, la palmeraie au coucher du soleil et les dunes d'Agafay offrent des ambiances dorées spectaculaires. Prévoyez une tenue qui suit le vent et des chaussures confortables.

Notre conseil : prévoyez deux tenues (une habillée, une décontractée) et venez détendus. Les meilleures photos de fiançailles sont celles où vous riez, chuchotez et vous regardez comme au premier jour.$$,
   $$https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=75$$,
   true, '2026-08-05T10:00:00Z'),
  ($$Photo ou vidéo à votre mariage : comment choisir$$,
   $$photo-ou-video-mariage$$,
   $$Photo ou vidéo ? Les deux ? Lumière, émotions, budget : nos conseils pour faire le bon choix pour votre mariage à Marrakech.$$,
   $$C'est la question que nous entendons le plus souvent : « Dois-je prendre un photographe, un vidéaste, ou les deux ? » La réponse dépend surtout de ce que vous voulez revivre dans dix ans.

La photo saisit l'instant : l'émotion d'une larme, le grain d'un regard, l'esthétique d'une scène. On la feuillette, on l'encadre, on la transmet. Un album de mariage reste l'objet souvenir par excellence.

La vidéo restitue le mouvement et le son : les vœux, les rires, les applaudissements, la voix de vos proches. Un film de mariage vous fait replonger dans l'ambiance exacte du jour J, bien mieux qu'une photo ne le peut.

Notre recommandation : si votre budget le permet, choisissez les deux en formule combinée, avec un même prestataire pour une cohérence de style et une journée plus fluide. Sinon, privilégiez la photo si vous aimez les souvenirs silencieux et élégants, la vidéo si vous voulez revivre les voix et les mouvements.$$,
   $$https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=75$$,
   true, '2026-08-20T10:00:00Z'),
  ($$Dix conseils pour des photos naturelles le jour J$$,
   $$10-conseils-photos-naturelles-jour-j$$,
   $$Souriez sans forcer, ignorez l'objectif, prévoyez une première vue... nos dix conseils de photographe pour des images fraîches et sincères.$$,
   $$Les mariés nous répètent souvent : « On n'est pas à l'aise en photo. » C'est normal. Et c'est justement notre travail de vous mettre à l'aise. Voici les dix conseils que nous donnons à tous nos couples.

1. Ne regardez jamais l'objectif pendant la cérémonie. Parlez-vous, touchez-vous, vivez le moment : c'est là que la magie opère.

2. Bougez naturellement. Marchez, tournez-vous, enlacez-vous : les poses figées donnent des photos rigides, le mouvement donne du vivant.

3. Choisissez des tenues confortables. Si vous baissez sans cesse votre robe ou votre col, aucune photo ne sera naturelle.

4. Prévoyez une « première vue » en privé, avant la cérémonie. Ces instants, à deux, donnent souvent les images les plus émouvantes de toute la journée.

5. Faites-vous confiance et fiez-vous aux consignes de votre photographe. Une simple phrase suffit souvent pour relancer la conversation et retrouver le naturel.

6. Le reste ? La lumière, le lieu et une équipe qui sait attendre le bon moment. Avec ces principes simples, vos photos seront fraîches, sincères et pleines de vous.$$,
   $$https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=75$$,
   true, '2026-09-10T10:00:00Z');

-- ---------- REVIEWS (approved so they show on the site) ----------
insert into public.reviews (work_id, name, rating, feedback, approved, created_at) values
  ('eb7f6fcc-7195-4b1f-9885-07474e8d0c55', 'Salma & Yassine', 5,
   $$Reportage de mariage incroyable ! Youssef a su capturer chaque émotion sans jamais se faire remarquer. Les photos sont magnifiques et livrées très vite. Merci pour ces souvenirs.$$,
   true, '2026-05-20T10:00:00Z'),
  (null, 'Karim B.', 5,
   $$Photographe très professionnel et à l'écoute. Le devis a été clair et la prestation impeccable. Je recommande les yeux fermés.$$,
   true, '2026-06-02T10:00:00Z'),
  ('f5ef9063-3bd0-430b-a875-9e6584569460', 'Fatima Zahra', 5,
   $$Séance fiançailles magique au coucher du soleil. Youssef nous a guidés avec douceur, on était à l'aise malgré notre timidité. Les résultats sont sublimes !$$,
   true, '2026-06-15T10:00:00Z'),
  (null, 'Amine', 4,
   $$Très bon travail, des photos réussies et une livraison rapide. Juste une petite attente les jours de forte demande, mais cela reste top.$$,
   true, '2026-06-27T10:00:00Z'),
  (null, 'Nadia', 5,
   $$Je recommande Youssef à tous les futurs mariés. Un vrai artiste, des conseils précieux et une équipe adorable. Les photos de notre réception sont de toute beauté.$$,
   true, '2026-07-08T10:00:00Z'),
  ('eb7f6fcc-7195-4b1f-9885-07474e8d0c55', 'Mehdi & Khadija', 5,
   $$On ne sait pas comment vous avez fait, mais vous avez saisi des moments qu'on n'avait même pas vus sur le moment ! Merci pour ce souvenir inoubliable.$$,
   true, '2026-07-19T10:00:00Z'),
  (null, 'Sara L.', 4,
   $$Belle collaboration, photos naturelles et un rendu très élégant. On aurait aimé encore plus de clichés, mais la qualité est au rendez-vous.$$,
   true, '2026-07-30T10:00:00Z'),
  (null, 'Omar', 5,
   $$Deux années de suite pour les événements de la famille. Toujours ponctuel, discret et créatif. Une valeur sûre à Marrakech.$$,
   true, '2026-08-11T10:00:00Z'),
  ('f5ef9063-3bd0-430b-a875-9e6584569460', 'Imane', 5,
   $$Séance à la palmeraie absolument parfaite. Les couleurs, la lumière, le cadrage... tout était pensé. Nous avons reçu nos photos en quelques jours, quel luxe !$$,
   true, '2026-08-22T10:00:00Z'),
  (null, 'Rachid & Sofia', 5,
   $$Des souvenirs qui valent de l'or. Merci pour la gentillesse et le professionnalisme. Vous méritez toutes les étoiles.$$,
   true, '2026-09-01T10:00:00Z'),
  (null, 'Yasmine', 4,
   $$Très contente du service, communication facile sur WhatsApp et résultat conforme à nos attentes. Je referai appel à lui sans hésiter.$$,
   true, '2026-09-10T10:00:00Z'),
  (null, 'Hicham', 5,
   $$Le meilleur photographe que nous ayons testé pour nos événements. Ponctuel, sérieux, et un rendu qui impressionne toujours nos clients.$$,
   true, '2026-09-18T10:00:00Z');