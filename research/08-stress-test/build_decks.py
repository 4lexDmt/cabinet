import re, glob, json, random

files = sorted(glob.glob('research/02-industries/*.md')) + ['research/04-consumer-cross-cutting.md']
STRIP_LABELS = ('preliminary scores', 'scores', 'solo-builder angle', 'solo-builder angle + caution')

cards = []
for fp in files:
    if '_template' in fp: continue
    text = open(fp).read()
    for part in re.split(r'^### ', text, flags=re.M)[1:]:
        lines = part.split('\n')
        title = lines[0].strip()
        pid = title.split('. ')[0].strip()
        body_keep = []
        for ln in lines[1:]:
            l = ln.strip()
            if not l: continue
            if l.startswith('## '): break  # next section of the file
            m = re.match(r'-\s*\*\*([^:*]+)[:*]', l)
            if m and any(m.group(1).strip().lower().startswith(s) for s in STRIP_LABELS):
                # skip this bullet and its continuation lines until next top-level bullet
                skip = True
                continue
            body_keep.append(ln)
        # reconstruct, dropping continuation lines of stripped bullets is handled by top-level bullet detection:
        cleaned = []
        skipping = False
        for ln in lines[1:]:
            l = ln.strip()
            if l.startswith('## '): break
            m = re.match(r'-\s*\*\*([^:*]+)[:*]', l)
            if m:
                label = m.group(1).strip().lower()
                skipping = any(label.startswith(s) for s in STRIP_LABELS)
                if skipping: continue
            if not skipping and l:
                cleaned.append(l)
        n_ev = len([l for l in cleaned if re.match(r'^\s*-\s*\[?\w', l) and ('http' in l)])
        pct_snippet = round(100*sum(1 for l in cleaned if 'snippet' in l.lower())/max(1,n_ev))
        cards.append({'id': pid, 'source_file': fp.split('/')[-1],
                      'title': title.split('. ',1)[1] if '. ' in title else title,
                      'card': '\n'.join(cleaned),
                      'n_evidence_links': n_ev, 'pct_snippet': pct_snippet})

ids = [c['id'] for c in cards]
assert len(ids) == len(set(ids)) == 145, f"got {len(ids)} ids, {len(set(ids))} unique"

VALIDATED_15 = ['education-P1','manufacturing-industrial-P1','personal-services-P2','accounting-P1',
 'npo-solar-P1','npo-solar-P6','healthcare-private-practice-P1','creative-creator-economy-P3',
 'insurance-P2','hr-staffing-P1','logistics-trucking-P1','restaurants-hospitality-P1',
 'agriculture-P1','real-estate-property-management-P2','it-msp-P1']
for v in VALIDATED_15: assert v in ids, v

rng = random.Random(145)
others = [i for i in ids if i not in VALIDATED_15]
overlap = VALIDATED_15 + rng.sample(others, 10)         # 25 cards scored by ALL auditors
unique = [i for i in ids if i not in overlap]           # 120 cards
rng.shuffle(unique)
decks = {'a': unique[0::3], 'b': unique[1::3], 'c': unique[2::3]}
by_id = {c['id']: c for c in cards}

for name, uids in decks.items():
    deck = [by_id[i] for i in uids + overlap]
    rng2 = random.Random(hash(name) % 10000)
    rng2.shuffle(deck)
    with open(f'research/08-stress-test/cards-agent-{name}.json','w') as f:
        json.dump(deck, f, indent=1)
    print(f'deck {name}: {len(deck)} cards')

with open('research/08-stress-test/problem-cards.json','w') as f:
    json.dump(cards, f, indent=1)
with open('research/08-stress-test/overlap-ids.json','w') as f:
    json.dump({'overlap': overlap, 'validated_15': VALIDATED_15}, f, indent=1)
print('total cards:', len(cards), '| overlap:', len(overlap))
# sanity: confirm stripping worked
leaks = [c['id'] for c in cards if 'solo-builder' in c['card'].lower() or 'preliminary scores' in c['card'].lower() or re.search(r'\*\*Scores', c['card'])]
print('leaked cards:', leaks[:5] if leaks else 'NONE')
