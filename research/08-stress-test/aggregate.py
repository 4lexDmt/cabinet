import json, re, glob, statistics as st

BASE = 'research/08-stress-test'
overlap = set(json.load(open(f'{BASE}/overlap-ids.json'))['overlap'])
PICKS = ['education-P1','manufacturing-industrial-P1','personal-services-P2','accounting-P1','npo-solar-P1']
VAL15 = json.load(open(f'{BASE}/overlap-ids.json'))['validated_15']

def norm_flags(fl):
    out = set()
    for f in (fl or []):
        m = re.search(r'F([1-6])', str(f))
        if m: out.add('F'+m.group(1))
    return out

PAY = lambda r: (3*r['s1'] + 2*(r['s2']+r['s3']+r['s4']+r['s5']+r['s6']) + r['s7'])/56*100

scores = {}   # id -> list of (agent, pay, flags, note)
per_agent_pay = {}
for ag in 'abc':
    data = json.load(open(f'{BASE}/scores-agent-{ag}.json'))
    deck_ids = {c['id'] for c in json.load(open(f'{BASE}/cards-agent-{ag}.json'))}
    got = {str(r['id']) for r in data}
    if got != deck_ids:
        print(f'WARN agent {ag}: missing={sorted(deck_ids-got)[:5]} extra={sorted(got-deck_ids)[:5]}')
    per_agent_pay[ag] = {}
    for r in data:
        rid = str(r['id'])
        for k in ('s1','s2','s3','s4','s5','s6','s7'):
            r[k] = int(r[k])
        p = PAY(r)
        per_agent_pay[ag][rid] = p
        scores.setdefault(rid, []).append((ag, p, norm_flags(r.get('flags')), str(r.get('note',''))[:120]))

# per-auditor top-quartile threshold (from their own 65 scores)
q75 = {ag: sorted(v.values())[int(len(v)*0.75)] for ag, v in per_agent_pay.items()}

# original weighted scores (same parse as 05)
orig = {}
files = sorted(glob.glob('research/02-industries/*.md')) + ['research/04-consumer-cross-cutting.md']
pat = re.compile(r'\*\*(?:Preliminary\s+)?[Ss]cores[^:*]*:\*\*\s*(.+)')
for fp in files:
    if '_template' in fp: continue
    for part in re.split(r'^### ', open(fp).read(), flags=re.M)[1:]:
        title = part.split('\n',1)[0].strip(); pid = title.split('. ')[0].strip()
        sm = pat.search(part)
        if not sm: continue
        nums = [float(x) for x in re.findall(r'(\d(?:\.\d)?)', sm.group(1))[:6]]
        if len(nums) == 6 and max(nums) <= 5:
            a,b,c,d,e,f = nums
            orig[pid] = 2*a+2*b+1.5*c+1.5*d+e+f
orig_rank = {pid: i+1 for i,(pid,_) in enumerate(sorted(orig.items(), key=lambda kv:-kv[1]))}

rows = []
for pid, entries in scores.items():
    pays = [p for _,p,_,_ in entries]
    mean_pay = sum(pays)/len(pays)
    spread = max(pays)-min(pays) if len(pays)>1 else 0.0
    flag_counts = {}
    for _,_,fl,_ in entries:
        for f in fl: flag_counts[f] = flag_counts.get(f,0)+1
    consensus_flags = sorted(f for f,c in flag_counts.items() if c>=2)
    any_flags = sorted(flag_counts)
    n = len(entries)
    single_flag = (n==1 and any_flags)
    if consensus_flags or mean_pay < 55: tier = 'UNLIKELY'
    elif mean_pay >= 70 and not any_flags: tier = 'PAY'
    else: tier = 'MAYBE'
    topq_votes = sum(1 for ag,p,_,_ in entries if p >= q75[ag])
    rows.append({'id': pid, 'pay': round(mean_pay,1), 'raters': n, 'spread': round(spread,1),
                 'flags': '+'.join(f"{f}x{flag_counts[f]}" for f in any_flags) or '-',
                 'consensus_flags': '+'.join(consensus_flags) or '-', 'tier': tier,
                 'topq_votes': f'{topq_votes}/{n}', 'orig': round(orig.get(pid,0),1),
                 'orig_rank': orig_rank.get(pid, 0),
                 'notes': ' | '.join(f'{ag}:{note}' for ag,_,_,note in entries)})

rows.sort(key=lambda r: -r['pay'])
for i,r in enumerate(rows,1): r['pay_rank'] = i

with open(f'{BASE}/ranking.tsv','w') as f:
    cols = ['pay_rank','id','pay','tier','raters','spread','flags','consensus_flags','topq_votes','orig','orig_rank']
    f.write('\t'.join(cols)+'\tnotes\n')
    for r in rows: f.write('\t'.join(str(r[c]) for c in cols)+'\t'+r['notes']+'\n')

# agreement on overlap
pair_deltas, contested = [], []
for pid in overlap:
    e = {ag:p for ag,p,_,_ in scores[pid]}
    if len(e)==3:
        ds = [abs(e['a']-e['b']), abs(e['a']-e['c']), abs(e['b']-e['c'])]
        pair_deltas += ds
        contested.append((max(ds), pid, {k:round(v,0) for k,v in e.items()}))
contested.sort(reverse=True)
agr = {'overlap_n': len(overlap), 'mean_pairwise_delta': round(st.mean(pair_deltas),1),
       'median_pairwise_delta': round(st.median(pair_deltas),1),
       'most_contested': [{'id':p,'max_delta':round(d,1),'scores':s} for d,p,s in contested[:6]]}
json.dump(agr, open(f'{BASE}/agreement.json','w'), indent=1)

tiers = {}
for r in rows: tiers[r['tier']] = tiers.get(r['tier'],0)+1
print('TIERS:', tiers, '| agreement mean|median pairwise ΔPAY:', agr['mean_pairwise_delta'], '|', agr['median_pairwise_delta'])
print('\n=== TOP 20 BY PAY ===')
for r in rows[:20]: print(f"{r['pay_rank']:>3} {r['pay']:>5} {r['tier']:<8} {r['topq_votes']:<4} fl:{r['consensus_flags']:<8} origR:{r['orig_rank']:<3} {r['id']}")
print('\n=== BOTTOM 15 ===')
for r in rows[-15:]: print(f"{r['pay_rank']:>3} {r['pay']:>5} {r['tier']:<8} fl:{r['flags']:<14} {r['id']}")
print('\n=== THE 5 PICKS ===')
for pid in PICKS:
    r = next(x for x in rows if x['id']==pid)
    print(f"{pid}: PAY {r['pay']} (rank {r['pay_rank']}/145) tier {r['tier']} spread {r['spread']} flags {r['flags']} consensus {r['consensus_flags']} topQ {r['topq_votes']} | origRank {r['orig_rank']}")
    print('   ', r['notes'][:300])
print('\n=== VALIDATED-15 (for reference) ===')
for pid in VAL15:
    r = next(x for x in rows if x['id']==pid)
    print(f"{r['pay_rank']:>3} PAY {r['pay']:>5} {r['tier']:<8} {pid}")
print('\n=== MOST CONTESTED (overlap) ===')
for c in agr['most_contested']: print(c)
