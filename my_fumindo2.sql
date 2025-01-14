--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2024-12-10 10:23:21 WIB

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16415)
-- Name: asset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset (
    asset_id integer NOT NULL,
    branch_id smallint NOT NULL,
    asset_name character varying(100) NOT NULL,
    category character varying(10) NOT NULL,
    initial_stock integer,
    current_stock integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tool_category_id integer,
    tool_condition_id integer,
    unit_id integer
);


ALTER TABLE public.asset OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16414)
-- Name: asset_asset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_asset_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asset_asset_id_seq OWNER TO postgres;

--
-- TOC entry 3692 (class 0 OID 0)
-- Dependencies: 223
-- Name: asset_asset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_asset_id_seq OWNED BY public.asset.asset_id;


--
-- TOC entry 226 (class 1259 OID 16424)
-- Name: asset_change_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_change_log (
    asset_log_id integer NOT NULL,
    asset_id integer NOT NULL,
    user_id integer,
    column_name character varying(50),
    value_before text,
    value_after text,
    operation character varying(15),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.asset_change_log OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16423)
-- Name: asset_change_log_asset_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asset_change_log_asset_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asset_change_log_asset_log_id_seq OWNER TO postgres;

--
-- TOC entry 3693 (class 0 OID 0)
-- Dependencies: 225
-- Name: asset_change_log_asset_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_change_log_asset_log_id_seq OWNED BY public.asset_change_log.asset_log_id;


--
-- TOC entry 228 (class 1259 OID 16454)
-- Name: blacklist_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blacklist_tokens (
    id_blacklist_token integer NOT NULL,
    token text NOT NULL,
    expired_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone
);


ALTER TABLE public.blacklist_tokens OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16453)
-- Name: blacklist_tokens_id_blacklist_token_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blacklist_tokens_id_blacklist_token_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blacklist_tokens_id_blacklist_token_seq OWNER TO postgres;

--
-- TOC entry 3694 (class 0 OID 0)
-- Dependencies: 227
-- Name: blacklist_tokens_id_blacklist_token_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blacklist_tokens_id_blacklist_token_seq OWNED BY public.blacklist_tokens.id_blacklist_token;


--
-- TOC entry 218 (class 1259 OID 16390)
-- Name: branch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branch (
    branch_id integer NOT NULL,
    branch_name character varying(100) NOT NULL,
    address text NOT NULL
);


ALTER TABLE public.branch OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16389)
-- Name: branch_branch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.branch_branch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branch_branch_id_seq OWNER TO postgres;

--
-- TOC entry 3695 (class 0 OID 0)
-- Dependencies: 217
-- Name: branch_branch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branch_branch_id_seq OWNED BY public.branch.branch_id;


--
-- TOC entry 220 (class 1259 OID 16399)
-- Name: employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee (
    employee_id integer NOT NULL,
    branch_id smallint NOT NULL,
    fullname character varying(100) NOT NULL,
    phone_number character varying(15),
    email character varying(100),
    address text,
    division character varying(50),
    status character varying(10)
);


ALTER TABLE public.employee OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16398)
-- Name: employee_employee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_employee_id_seq OWNER TO postgres;

--
-- TOC entry 3696 (class 0 OID 0)
-- Dependencies: 219
-- Name: employee_employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_employee_id_seq OWNED BY public.employee.employee_id;


--
-- TOC entry 230 (class 1259 OID 24577)
-- Name: tool_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tool_category (
    tool_category_id integer NOT NULL,
    tool_category_name character varying(50) NOT NULL
);


ALTER TABLE public.tool_category OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 24576)
-- Name: tool_category_tool_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tool_category_tool_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tool_category_tool_category_id_seq OWNER TO postgres;

--
-- TOC entry 3697 (class 0 OID 0)
-- Dependencies: 229
-- Name: tool_category_tool_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tool_category_tool_category_id_seq OWNED BY public.tool_category.tool_category_id;


--
-- TOC entry 232 (class 1259 OID 24584)
-- Name: tool_condition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tool_condition (
    tool_condition_id integer NOT NULL,
    tool_condition_name character varying(30) NOT NULL
);


ALTER TABLE public.tool_condition OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 24583)
-- Name: tool_condition_tool_condition_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tool_condition_tool_condition_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tool_condition_tool_condition_id_seq OWNER TO postgres;

--
-- TOC entry 3698 (class 0 OID 0)
-- Dependencies: 231
-- Name: tool_condition_tool_condition_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tool_condition_tool_condition_id_seq OWNED BY public.tool_condition.tool_condition_id;


--
-- TOC entry 234 (class 1259 OID 24591)
-- Name: unit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit (
    unit_id integer NOT NULL,
    unit_name character varying(15) NOT NULL
);


ALTER TABLE public.unit OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 24590)
-- Name: unit_unit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unit_unit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unit_unit_id_seq OWNER TO postgres;

--
-- TOC entry 3699 (class 0 OID 0)
-- Dependencies: 233
-- Name: unit_unit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unit_unit_id_seq OWNED BY public.unit.unit_id;


--
-- TOC entry 222 (class 1259 OID 16408)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    user_id integer NOT NULL,
    employee_id integer,
    username character varying(30) NOT NULL,
    password character varying(255) NOT NULL,
    type_user character varying(30),
    role character varying(30)
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16407)
-- Name: user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_user_id_seq OWNER TO postgres;

--
-- TOC entry 3700 (class 0 OID 0)
-- Dependencies: 221
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_user_id_seq OWNED BY public."user".user_id;


--
-- TOC entry 3493 (class 2604 OID 16418)
-- Name: asset asset_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset ALTER COLUMN asset_id SET DEFAULT nextval('public.asset_asset_id_seq'::regclass);


--
-- TOC entry 3496 (class 2604 OID 16427)
-- Name: asset_change_log asset_log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_change_log ALTER COLUMN asset_log_id SET DEFAULT nextval('public.asset_change_log_asset_log_id_seq'::regclass);


--
-- TOC entry 3498 (class 2604 OID 16457)
-- Name: blacklist_tokens id_blacklist_token; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blacklist_tokens ALTER COLUMN id_blacklist_token SET DEFAULT nextval('public.blacklist_tokens_id_blacklist_token_seq'::regclass);


--
-- TOC entry 3490 (class 2604 OID 16393)
-- Name: branch branch_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch ALTER COLUMN branch_id SET DEFAULT nextval('public.branch_branch_id_seq'::regclass);


--
-- TOC entry 3491 (class 2604 OID 16402)
-- Name: employee employee_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee ALTER COLUMN employee_id SET DEFAULT nextval('public.employee_employee_id_seq'::regclass);


--
-- TOC entry 3499 (class 2604 OID 24580)
-- Name: tool_category tool_category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool_category ALTER COLUMN tool_category_id SET DEFAULT nextval('public.tool_category_tool_category_id_seq'::regclass);


--
-- TOC entry 3500 (class 2604 OID 24587)
-- Name: tool_condition tool_condition_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool_condition ALTER COLUMN tool_condition_id SET DEFAULT nextval('public.tool_condition_tool_condition_id_seq'::regclass);


--
-- TOC entry 3501 (class 2604 OID 24594)
-- Name: unit unit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit ALTER COLUMN unit_id SET DEFAULT nextval('public.unit_unit_id_seq'::regclass);


--
-- TOC entry 3492 (class 2604 OID 16411)
-- Name: user user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN user_id SET DEFAULT nextval('public.user_user_id_seq'::regclass);


--
-- TOC entry 3676 (class 0 OID 16415)
-- Dependencies: 224
-- Data for Name: asset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset (asset_id, branch_id, asset_name, category, initial_stock, current_stock, created_at, updated_at, tool_category_id, tool_condition_id, unit_id) FROM stdin;
17	3	BLOWER KRISBOW + BELALAI	Alat	4	3	2024-12-02 17:11:18.225283+07	2024-12-02 17:11:18.225283+07	40	7	14
15	4	BESTRIN FORTE 100 ECE	Bahan	13	10	2024-11-29 09:19:44.685233+07	2024-11-29 09:19:44.685233+07	38	0	12
14	4	RODEX 0,005 BB	Bahan	10	8	2024-11-29 09:19:14.636593+07	2024-11-29 09:19:14.636593+07	38	0	10
13	4	RATGONE 0,005 BB	Bahan	11	9	2024-11-29 09:18:53.411271+07	2024-11-29 09:18:53.411271+07	40	0	10
12	4	SARUNG TANGAN KATUN	Bahan	16	13	2024-11-29 09:17:59.283976+07	2024-11-29 09:17:59.283976+07	40	0	13
11	4	SULFURYL FLOURIDE	Bahan	8	8	2024-11-29 09:17:29.385507+07	2024-11-29 09:17:29.385507+07	38	0	14
10	3	PHOSPHIN/ PH3 (KINGPHOST)	Bahan	20	18	2024-11-29 09:17:10.105979+07	2024-11-29 09:17:10.105979+07	38	0	12
9	3	METHYL BROMIDE	Bahan	10	8	2024-11-29 09:16:43.847454+07	2024-11-29 09:16:43.847454+07	38	0	12
8	3	FOGGING TASCO KN 150	Alat	3	2	2024-11-29 09:15:14.554919+07	2024-11-29 09:15:14.554919+07	40	7	14
7	4	LASER DISTANCE METER	Alat	3	3	2024-11-29 09:14:47.90732+07	2024-11-29 09:14:47.90732+07	39	6	14
6	3	INTERFEROMETER RIKEN KEIKI F 121 SERI: 398030008YS	Alat	3	2	2024-11-29 09:14:10.265692+07	2024-11-29 09:14:10.265692+07	39	7	14
5	4	TANGGA TELESCOPIK 2M	Alat	4	4	2024-11-29 09:13:31.61929+07	2024-11-29 09:13:31.61929+07	38	6	14
4	3	SCBA	Alat	2	2	2024-11-29 09:13:06.273935+07	2024-11-29 09:13:06.273935+07	40	2	14
3	4	BLOWER KRISBOW + BELALAI	Alat	4	3	2024-11-29 09:11:57.229824+07	2024-11-29 09:11:57.229824+07	38	1	14
16	4	SCBA FMS	Alat	3	2	2024-11-29 09:31:28.425234+07	2024-11-29 09:31:28.425234+07	38	7	14
\.


--
-- TOC entry 3678 (class 0 OID 16424)
-- Dependencies: 226
-- Data for Name: asset_change_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_change_log (asset_log_id, asset_id, user_id, column_name, value_before, value_after, operation, created_at) FROM stdin;
215	15	3	asset_name	BESTRIN FORTE 100 EC	BESTRIN FORTE 100 ECE	Edit	2024-12-04 16:07:25.935781+07
219	5	3	tool_category_id	\N	38	Edit	2024-12-04 16:08:37.115833+07
221	7	3	tool_category_id	\N	39	Edit	2024-12-04 16:08:48.534388+07
224	8	3	tool_category_id	\N	40	Edit	2024-12-04 16:09:25.149492+07
235	16	3	tool_category_id	0	38	Edit	2024-12-04 16:13:24.87217+07
98	12	10	asset_id	12	\N	Tambah	2024-11-29 09:17:59.343436+07
99	12	10	branch_id	4	4	Tambah	2024-11-29 09:17:59.34472+07
100	12	10	asset_name	SARUNG TANGAN KATUN	SARUNG TANGAN KATUN	Tambah	2024-11-29 09:17:59.345425+07
101	12	10	category	Bahan	Bahan	Tambah	2024-11-29 09:17:59.345995+07
102	12	10	tool_category			Tambah	2024-11-29 09:17:59.346612+07
103	12	10	tool_condition			Tambah	2024-11-29 09:17:59.347216+07
104	12	10	unit	PCS	PCS	Tambah	2024-11-29 09:17:59.349894+07
105	12	10	initial_stock	16	16	Tambah	2024-11-29 09:17:59.352786+07
262	15	1	tool_category_id	0	38	Edit	2024-12-05 09:40:27.537729+07
263	15	1	tool_condition_id	\N	0	Edit	2024-12-05 09:40:27.540495+07
264	15	1	unit_id	\N	12	Edit	2024-12-05 09:40:27.542696+07
271	12	1	tool_category_id	0	40	Edit	2024-12-05 09:41:04.199526+07
272	12	1	tool_condition_id	\N	0	Edit	2024-12-05 09:41:04.201669+07
273	12	1	unit_id	\N	13	Edit	2024-12-05 09:41:04.203227+07
279	10	1	tool_category_id	0	38	Edit	2024-12-05 09:42:43.658592+07
280	10	1	unit_id	13	12	Edit	2024-12-05 09:42:43.665715+07
288	6	1	tool_condition_id	\N	7	Edit	2024-12-05 09:43:27.639611+07
289	6	1	unit_id	\N	14	Edit	2024-12-05 09:43:27.642029+07
291	4	1	unit_id	\N	14	Edit	2024-12-05 09:43:43.978779+07
11	3	1	asset_id	3	\N	Tambah	2024-11-29 09:11:57.242418+07
12	3	1	branch_id	4	4	Tambah	2024-11-29 09:11:57.244837+07
13	3	1	asset_name	BLOWER KRISBOW + BELALAI	BLOWER KRISBOW + BELALAI	Tambah	2024-11-29 09:11:57.267245+07
14	3	1	category	Alat	Alat	Tambah	2024-11-29 09:11:57.280905+07
15	3	1	tool_category	Peralatan Fumigasi	Peralatan Fumigasi	Tambah	2024-11-29 09:11:57.282301+07
16	3	1	tool_condition	Baik	Baik	Tambah	2024-11-29 09:11:57.307227+07
17	3	1	unit	UNIT	UNIT	Tambah	2024-11-29 09:11:57.308386+07
18	3	1	initial_stock	4	4	Tambah	2024-11-29 09:11:57.308939+07
29	5	3	asset_id	5	\N	Tambah	2024-11-29 09:13:31.625088+07
30	5	3	branch_id	4	4	Tambah	2024-11-29 09:13:31.627503+07
31	5	3	asset_name	TANGGA TELESCOPIK 2M	TANGGA TELESCOPIK 2M	Tambah	2024-11-29 09:13:31.629585+07
32	5	3	category	Alat	Alat	Tambah	2024-11-29 09:13:31.631171+07
33	5	3	tool_category	Peralatan Fumigasi	Peralatan Fumigasi	Tambah	2024-11-29 09:13:31.633294+07
34	5	3	tool_condition	Baik	Baik	Tambah	2024-11-29 09:13:31.635997+07
35	5	3	unit	UNIT	UNIT	Tambah	2024-11-29 09:13:31.65768+07
36	5	3	initial_stock	4	4	Tambah	2024-11-29 09:13:31.665909+07
37	5	3	current_stock	4	4	Tambah	2024-11-29 09:13:31.666989+07
38	6	4	asset_id	6	\N	Tambah	2024-11-29 09:14:10.271107+07
39	6	4	branch_id	3	3	Tambah	2024-11-29 09:14:10.274306+07
40	6	4	asset_name	INTERFEROMETER RIKEN KEIKI F 121 SERI: 398030008YS	INTERFEROMETER RIKEN KEIKI F 121 SERI: 398030008YS	Tambah	2024-11-29 09:14:10.275703+07
41	6	4	category	Alat	Alat	Tambah	2024-11-29 09:14:10.276482+07
42	6	4	tool_category	Alat Ukur Fumigasi	Alat Ukur Fumigasi	Tambah	2024-11-29 09:14:10.277084+07
43	6	4	tool_condition	Rusak	Rusak	Tambah	2024-11-29 09:14:10.292089+07
56	8	5	asset_id	8	\N	Tambah	2024-11-29 09:15:14.576678+07
57	8	5	branch_id	3	3	Tambah	2024-11-29 09:15:14.57815+07
58	8	5	asset_name	Coba Alat	Coba Alat	Tambah	2024-11-29 09:15:14.579077+07
59	8	5	category	Bahan	Bahan	Tambah	2024-11-29 09:15:14.580047+07
60	8	5	tool_category			Tambah	2024-11-29 09:15:14.583719+07
61	8	5	tool_condition			Tambah	2024-11-29 09:15:14.589943+07
62	8	5	unit	PCS	PCS	Tambah	2024-11-29 09:15:14.594325+07
63	8	5	initial_stock	3	3	Tambah	2024-11-29 09:15:14.595781+07
64	8	5	current_stock	3	3	Tambah	2024-11-29 09:15:14.597035+07
80	10	10	asset_id	10	\N	Tambah	2024-11-29 09:17:10.11228+07
65	8	9	asset_name	Coba Alat	FOGGING TASCO KN 150	Edit	2024-11-29 09:15:31.638253+07
66	8	9	category	Bahan	Alat	Edit	2024-11-29 09:15:31.651231+07
67	8	9	tool_category		Peralatan Pest Control	Edit	2024-11-29 09:15:31.652905+07
68	8	9	tool_condition		Baik	Edit	2024-11-29 09:15:31.655594+07
69	8	9	unit	PCS	UNIT	Edit	2024-11-29 09:15:31.656616+07
70	8	9	current_stock	3	2	Edit	2024-11-29 09:15:31.657235+07
71	9	5	asset_id	9	\N	Tambah	2024-11-29 09:16:43.855329+07
72	9	5	branch_id	3	3	Tambah	2024-11-29 09:16:43.857136+07
73	9	5	asset_name	METHYL BROMIDE	METHYL BROMIDE	Tambah	2024-11-29 09:16:43.858533+07
74	9	5	category	Bahan	Bahan	Tambah	2024-11-29 09:16:43.86061+07
75	9	5	tool_category			Tambah	2024-11-29 09:16:43.862901+07
81	10	10	branch_id	3	3	Tambah	2024-11-29 09:17:10.114563+07
82	10	10	asset_name	PHOSPHIN/ PH3 (KINGPHOST)	PHOSPHIN/ PH3 (KINGPHOST)	Tambah	2024-11-29 09:17:10.12948+07
83	10	10	category	Bahan	Bahan	Tambah	2024-11-29 09:17:10.18946+07
84	10	10	tool_category			Tambah	2024-11-29 09:17:10.194049+07
85	10	10	tool_condition			Tambah	2024-11-29 09:17:10.195321+07
86	10	10	unit	KG	KG	Tambah	2024-11-29 09:17:10.196487+07
87	10	10	initial_stock	20	20	Tambah	2024-11-29 09:17:10.19754+07
88	10	10	current_stock	18	18	Tambah	2024-11-29 09:17:10.198383+07
89	11	9	asset_id	11	\N	Tambah	2024-11-29 09:17:29.40742+07
90	11	9	branch_id	4	4	Tambah	2024-11-29 09:17:29.409095+07
91	11	9	asset_name	SULFURYL FLOURIDE	SULFURYL FLOURIDE	Tambah	2024-11-29 09:17:29.410244+07
92	11	9	category	Bahan	Bahan	Tambah	2024-11-29 09:17:29.412176+07
93	11	9	tool_category			Tambah	2024-11-29 09:17:29.425461+07
19	3	1	current_stock	3	3	Tambah	2024-11-29 09:11:57.309415+07
20	4	1	asset_id	4	\N	Tambah	2024-11-29 09:13:06.326652+07
21	4	1	branch_id	3	3	Tambah	2024-11-29 09:13:06.328408+07
22	4	1	asset_name	SCBA	SCBA	Tambah	2024-11-29 09:13:06.329726+07
23	4	1	category	Alat	Alat	Tambah	2024-11-29 09:13:06.330692+07
24	4	1	tool_category	Peralatan Fumigasi	Peralatan Fumigasi	Tambah	2024-11-29 09:13:06.332034+07
25	4	1	tool_condition	Baik	Baik	Tambah	2024-11-29 09:13:06.33319+07
26	4	1	unit	UNIT	UNIT	Tambah	2024-11-29 09:13:06.333973+07
27	4	1	initial_stock	2	2	Tambah	2024-11-29 09:13:06.334523+07
28	4	1	current_stock	2	2	Tambah	2024-11-29 09:13:06.335179+07
44	6	4	unit	UNIT	UNIT	Tambah	2024-11-29 09:14:10.294094+07
45	6	4	initial_stock	3	3	Tambah	2024-11-29 09:14:10.295555+07
46	6	4	current_stock	2	2	Tambah	2024-11-29 09:14:10.296359+07
47	7	1	asset_id	7	\N	Tambah	2024-11-29 09:14:47.909995+07
48	7	1	branch_id	4	4	Tambah	2024-11-29 09:14:47.912189+07
49	7	1	asset_name	LASER DISTANCE METER	LASER DISTANCE METER	Tambah	2024-11-29 09:14:47.912909+07
50	7	1	category	Alat	Alat	Tambah	2024-11-29 09:14:47.9135+07
51	7	1	tool_category	Alat Ukur Fumigasi	Alat Ukur Fumigasi	Tambah	2024-11-29 09:14:47.914127+07
52	7	1	tool_condition	Baik	Baik	Tambah	2024-11-29 09:14:47.915711+07
53	7	1	unit	UNIT	UNIT	Tambah	2024-11-29 09:14:47.916846+07
54	7	1	initial_stock	3	3	Tambah	2024-11-29 09:14:47.917378+07
55	7	1	current_stock	3	3	Tambah	2024-11-29 09:14:47.917853+07
216	17	3	tool_category_id	\N	38	Edit	2024-12-04 16:07:54.70078+07
217	3	3	tool_category_id	\N	38	Edit	2024-12-04 16:08:14.31764+07
222	16	3	tool_category_id	\N	40	Edit	2024-12-04 16:09:00.736528+07
225	10	3	tool_category_id	\N	0	Edit	2024-12-04 16:11:40.729258+07
236	17	3	tool_category_id	0	40	Edit	2024-12-04 16:13:31.026888+07
106	12	10	current_stock	13	13	Tambah	2024-11-29 09:17:59.353532+07
107	13	4	asset_id	13	\N	Tambah	2024-11-29 09:18:53.530139+07
108	13	4	branch_id	4	4	Tambah	2024-11-29 09:18:53.548671+07
265	14	1	tool_category_id	0	38	Edit	2024-12-05 09:40:41.52726+07
266	14	1	tool_condition_id	\N	0	Edit	2024-12-05 09:40:41.528858+07
267	14	1	unit_id	\N	10	Edit	2024-12-05 09:40:41.529856+07
274	11	1	tool_category_id	0	38	Edit	2024-12-05 09:41:14.052427+07
275	11	1	tool_condition_id	\N	0	Edit	2024-12-05 09:41:14.055782+07
276	11	1	unit_id	\N	14	Edit	2024-12-05 09:41:14.059438+07
281	9	1	tool_category_id	0	38	Edit	2024-12-05 09:42:57.354169+07
282	9	1	tool_condition_id	\N	0	Edit	2024-12-05 09:42:57.355769+07
283	9	1	unit_id	\N	12	Edit	2024-12-05 09:42:57.356642+07
109	13	4	asset_name	RATGONE 0,005 BB	RATGONE 0,005 BB	Tambah	2024-11-29 09:18:53.551612+07
110	13	4	category	Bahan	Bahan	Tambah	2024-11-29 09:18:53.553078+07
111	13	4	tool_category			Tambah	2024-11-29 09:18:53.554081+07
112	13	4	tool_condition			Tambah	2024-11-29 09:18:53.555032+07
113	13	4	unit	GRAM	GRAM	Tambah	2024-11-29 09:18:53.55583+07
114	13	4	initial_stock	11	11	Tambah	2024-11-29 09:18:53.556545+07
115	13	4	current_stock	9	9	Tambah	2024-11-29 09:18:53.55723+07
116	14	3	asset_id	14	\N	Tambah	2024-11-29 09:19:14.746573+07
117	14	3	branch_id	4	4	Tambah	2024-11-29 09:19:14.750667+07
118	14	3	asset_name	RODEX 0,005 BB	RODEX 0,005 BB	Tambah	2024-11-29 09:19:14.75175+07
119	14	3	category	Bahan	Bahan	Tambah	2024-11-29 09:19:14.752568+07
120	14	3	tool_category			Tambah	2024-11-29 09:19:14.753931+07
121	14	3	tool_condition			Tambah	2024-11-29 09:19:14.756364+07
122	14	3	unit	GRAM	GRAM	Tambah	2024-11-29 09:19:14.757625+07
123	14	3	initial_stock	10	10	Tambah	2024-11-29 09:19:14.758474+07
124	14	3	current_stock	8	8	Tambah	2024-11-29 09:19:14.759366+07
125	15	9	asset_id	15	\N	Tambah	2024-11-29 09:19:44.694162+07
126	15	9	branch_id	4	4	Tambah	2024-11-29 09:19:44.695102+07
127	15	9	asset_name	 BESTRIN FORTE 100 EC	 BESTRIN FORTE 100 EC	Tambah	2024-11-29 09:19:44.697776+07
128	15	9	category	Bahan	Bahan	Tambah	2024-11-29 09:19:44.699134+07
129	15	9	tool_category			Tambah	2024-11-29 09:19:44.703582+07
130	15	9	tool_condition			Tambah	2024-11-29 09:19:44.704673+07
131	15	9	unit	L	L	Tambah	2024-11-29 09:19:44.705453+07
132	15	9	initial_stock	13	13	Tambah	2024-11-29 09:19:44.706215+07
133	15	9	current_stock	10	10	Tambah	2024-11-29 09:19:44.716525+07
134	16	10	asset_id	16	\N	Tambah	2024-11-29 09:31:28.436542+07
135	16	10	branch_id	4	4	Tambah	2024-11-29 09:31:28.457307+07
136	16	10	asset_name	SCBA FMS	SCBA FMS	Tambah	2024-11-29 09:31:28.458869+07
137	16	10	category	Alat	Alat	Tambah	2024-11-29 09:31:28.460544+07
138	16	10	tool_category	Peralatan Fumigasi	Peralatan Fumigasi	Tambah	2024-11-29 09:31:28.462133+07
139	16	10	tool_condition	Baik	Baik	Tambah	2024-11-29 09:31:28.463331+07
140	16	10	unit	UNIT	UNIT	Tambah	2024-11-29 09:31:28.464228+07
141	16	10	initial_stock	3	3	Tambah	2024-11-29 09:31:28.464884+07
142	16	10	current_stock	2	2	Tambah	2024-11-29 09:31:28.465413+07
143	17	4	asset_id	17	\N	Tambah	2024-12-02 17:11:18.249421+07
144	17	4	branch_id	3	3	Tambah	2024-12-02 17:11:18.255278+07
145	17	4	asset_name	BLOWER KRISBOW + BELALAI	BLOWER KRISBOW + BELALAI	Tambah	2024-12-02 17:11:18.256562+07
146	17	4	category	Alat	Alat	Tambah	2024-12-02 17:11:18.259303+07
147	17	4	tool_category	Alat Ukur Fumigasi	Alat Ukur Fumigasi	Tambah	2024-12-02 17:11:18.261676+07
148	17	4	tool_condition	Cukup	Cukup	Tambah	2024-12-02 17:11:18.262486+07
149	17	4	unit	UNIT	UNIT	Tambah	2024-12-02 17:11:18.263141+07
150	17	4	initial_stock	4	4	Tambah	2024-12-02 17:11:18.263892+07
151	17	4	current_stock	3	3	Tambah	2024-12-02 17:11:18.264704+07
293	16	8	tool_condition_id	\N	7	Edit	2024-12-05 09:44:07.260435+07
294	16	8	unit_id	\N	14	Edit	2024-12-05 09:44:07.262409+07
218	4	3	tool_category_id	\N	40	Edit	2024-12-04 16:08:29.127086+07
220	6	3	tool_category_id	\N	39	Edit	2024-12-04 16:08:43.007131+07
223	16	3	tool_category_id	40	38	Edit	2024-12-04 16:09:12.220228+07
213	15	3	tool_category_id	\N	0	Edit	2024-12-04 15:55:38.029058+07
214	15	3	asset_name	 BESTRIN FORTE 100 EC	BESTRIN FORTE 100 EC	Edit	2024-12-04 15:55:38.03098+07
260	17	1	tool_condition_id	\N	7	Edit	2024-12-05 09:38:50.364551+07
261	17	1	unit_id	\N	14	Edit	2024-12-05 09:38:50.367638+07
268	13	1	tool_category_id	0	40	Edit	2024-12-05 09:40:53.018617+07
269	13	1	tool_condition_id	\N	0	Edit	2024-12-05 09:40:53.027895+07
270	13	1	unit_id	\N	10	Edit	2024-12-05 09:40:53.031317+07
277	10	1	tool_condition_id	\N	0	Edit	2024-12-05 09:41:29.440615+07
278	10	1	unit_id	\N	13	Edit	2024-12-05 09:41:29.443268+07
284	8	1	tool_condition_id	\N	7	Edit	2024-12-05 09:43:08.845756+07
285	8	1	unit_id	\N	14	Edit	2024-12-05 09:43:08.849043+07
286	7	1	tool_condition_id	\N	6	Edit	2024-12-05 09:43:19.251107+07
287	7	1	unit_id	\N	14	Edit	2024-12-05 09:43:19.253021+07
290	5	1	unit_id	\N	14	Edit	2024-12-05 09:43:33.952713+07
292	3	1	unit_id	\N	14	Edit	2024-12-05 09:43:47.750351+07
76	9	5	tool_condition			Tambah	2024-11-29 09:16:43.864481+07
77	9	5	unit	TABUNG	TABUNG	Tambah	2024-11-29 09:16:43.87823+07
78	9	5	initial_stock	10	10	Tambah	2024-11-29 09:16:43.880706+07
79	9	5	current_stock	8	8	Tambah	2024-11-29 09:16:43.882152+07
94	11	9	tool_condition			Tambah	2024-11-29 09:17:29.427051+07
95	11	9	unit	TABUNG	TABUNG	Tambah	2024-11-29 09:17:29.429109+07
96	11	9	initial_stock	8	8	Tambah	2024-11-29 09:17:29.431087+07
97	11	9	current_stock	8	8	Tambah	2024-11-29 09:17:29.438135+07
\.


--
-- TOC entry 3680 (class 0 OID 16454)
-- Dependencies: 228
-- Data for Name: blacklist_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blacklist_tokens (id_blacklist_token, token, expired_at, created_at) FROM stdin;
13	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoYW5kcmEyNTI1Iiwic3ViIjoxLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3MzM3MTU5NTYsImV4cCI6MTczMzgwMjM1Nn0.G4jKAXj4GE0bzCNdh8_j9ZlVk8t3Rcc5srX7_L_v2dI	2024-12-10 10:46:00.803+07	2024-12-09 10:46:00.804+07
14	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoYW5kcmEyNTI1Iiwic3ViIjoxLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3MzM3MTYyOTUsImV4cCI6MTczMzgwMjY5NX0.BgebOXcpDZekrEL3ma3x3SpXyXurD33aO_UrGJCcN3U	2024-12-10 22:44:12.879+07	2024-12-09 22:44:12.882+07
15	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoYW5kcmEyNTI1Iiwic3ViIjoxLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3MzM3NTkwNTYsImV4cCI6MTczMzg0NTQ1Nn0.UmHgvgWTgA7lcuqOsdlcx_DABx6JPtU7O6TArb36JK4	2024-12-10 23:25:14.99+07	2024-12-09 23:25:14.991+07
16	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoYW5kcmEyNTI1Iiwic3ViIjoxLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3MzM3NjE1MTksImV4cCI6MTczMzg0NzkxOX0.AlUn4fu8h_0cyIZgmuLNay1GK4snjwnmk-D5JgK5HU8	2024-12-10 23:47:10.764+07	2024-12-09 23:47:10.765+07
17	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoYW5kcmEyNTI1Iiwic3ViIjoxLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3MzM3NjI4MzYsImV4cCI6MTczMzg0OTIzNn0.Xlwe21lUbBERu9aUiQLweCTHF1o3txWJxKcXm8-nQQo	2024-12-11 09:42:55.442+07	2024-12-10 09:42:55.445+07
\.


--
-- TOC entry 3670 (class 0 OID 16390)
-- Dependencies: 218
-- Data for Name: branch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branch (branch_id, branch_name, address) FROM stdin;
4	Fumindo Karawang	Jl.Raya Kopel Kp. Kelapa Nunggal RT. 027 RW. 007 Desa Gintung Kerta, Karawang, 41371\nJawa Barat - Indonesia
3	Fumindo Surabaya	Jl. Margomulyo 51 A, No. 41, Greges, Kec. Asemrowo, Surabaya, 60183\nJawa Timur - Indonesia
\.


--
-- TOC entry 3672 (class 0 OID 16399)
-- Dependencies: 220
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee (employee_id, branch_id, fullname, phone_number, email, address, division, status) FROM stdin;
2	3	Santi	083465657878	santi@gmail.com	Jl. Temanggung	Admin	Offline
3	4	Bagus	082156567878	bagus@gmai.com	Jl Gentara	Technician and Operational	Offline
4	3	Yoggy	082189894455	yoggy@gmail.com	Jl. Rajawali	Admin	Offline
1	3	Chandra Tirta	089692863233	chandra@gmail.com	Jl Kanda	Admin	Offline
9	3	Sayuti	82145457878	sayuti@gmail.com	Jl. Lambang	Technician and Operational	Offline
10	3	Kipli	\N	\N	\N	Technician and Operational	Offline
11	4	Michael	\N	michael@gmail.com	\N	Service Technician	Offline
14	3	Cahya	823423432	cahya@gmail.com	Jl. G obos 17	Admin	Offline
15	4	Adi	845454545	\N	\N	Admin	Offline
\.


--
-- TOC entry 3682 (class 0 OID 24577)
-- Dependencies: 230
-- Data for Name: tool_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tool_category (tool_category_id, tool_category_name) FROM stdin;
39	Alat Ukur Fumigasi
41	Plastic Sheet
40	Pest Control
38	Fumigasi
\.


--
-- TOC entry 3684 (class 0 OID 24584)
-- Dependencies: 232
-- Data for Name: tool_condition; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tool_condition (tool_condition_id, tool_condition_name) FROM stdin;
1	Rusak
2	Kurang
6	Cukup
7	Baik
\.


--
-- TOC entry 3686 (class 0 OID 24591)
-- Dependencies: 234
-- Data for Name: unit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unit (unit_id, unit_name) FROM stdin;
14	UNIT
13	PCS
12	TABUNG
11	KG
10	GRAM
9	L
8	ML
7	M
5	BUTIR
3	BAG
2	PACK
1	SHEET
\.


--
-- TOC entry 3674 (class 0 OID 16408)
-- Dependencies: 222
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (user_id, employee_id, username, password, type_user, role) FROM stdin;
4	2	santi@gmail.com	$2a$10$v52yQNUqIC2BmI3YhFLnv.HzUX0y4GuMOEg7.k04cHNF7/9Y62BOW	Employee	Admin
3	\N	aisyah2525	$2a$10$qmXMIVAuQUGBJZqdqoeCaepsh7IdQVrl86XCeoWw42WB5J7N7xIci	Employee	Admin
5	4	yoggy@gmail.com	$2a$10$EpT7aQaSYuE.1oS/GYnmduBuKhyNk9sKn8ODjs2mHAV/sRiXm0V3u	Employee	Admin
9	10	kipli2525	$2a$10$wmR8rCwmojp1klkARCetAOp5MO1bXw0pZ4L4ngip2plrHmUHusOoC	Employee	Petugas Lapangan
8	9	sayuti2525	$2a$10$gioSR0wvwBTK36lb.bfKru/kx/zkBmj8KVaXgPACtI.qgQs3Eh3j6	Employee	Petugas Lapangan
10	14	cahya2525	$2a$10$mZQL.EJSx24Mgxo/IcwTuOlj1b23UOmMxiXUTlgqRoPziVkHbLg4K	\N	Manajer Teknis
1	1	chandra2525	$2a$10$.jsNzd9.URRQ9tsxw8YN8.lWd2MjtQkMVMj8.mjWrobCCpyA2mShi	Employee	Admin
16	\N	asdasd	$2a$10$r76I203GLcQidt7Zqj4QdOQVr1KhYZivUh4P12.TYsoJjS8emLWoq	\N	Admin
\.


--
-- TOC entry 3701 (class 0 OID 0)
-- Dependencies: 223
-- Name: asset_asset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_asset_id_seq', 68, true);


--
-- TOC entry 3702 (class 0 OID 0)
-- Dependencies: 225
-- Name: asset_change_log_asset_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_change_log_asset_log_id_seq', 351, true);


--
-- TOC entry 3703 (class 0 OID 0)
-- Dependencies: 227
-- Name: blacklist_tokens_id_blacklist_token_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blacklist_tokens_id_blacklist_token_seq', 17, true);


--
-- TOC entry 3704 (class 0 OID 0)
-- Dependencies: 217
-- Name: branch_branch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branch_branch_id_seq', 145, true);


--
-- TOC entry 3705 (class 0 OID 0)
-- Dependencies: 219
-- Name: employee_employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_employee_id_seq', 28, true);


--
-- TOC entry 3706 (class 0 OID 0)
-- Dependencies: 229
-- Name: tool_category_tool_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tool_category_tool_category_id_seq', 41, true);


--
-- TOC entry 3707 (class 0 OID 0)
-- Dependencies: 231
-- Name: tool_condition_tool_condition_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tool_condition_tool_condition_id_seq', 36, true);


--
-- TOC entry 3708 (class 0 OID 0)
-- Dependencies: 233
-- Name: unit_unit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unit_unit_id_seq', 26, true);


--
-- TOC entry 3709 (class 0 OID 0)
-- Dependencies: 221
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_user_id_seq', 17, true);


--
-- TOC entry 3511 (class 2606 OID 16432)
-- Name: asset_change_log asset_change_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_change_log
    ADD CONSTRAINT asset_change_log_pkey PRIMARY KEY (asset_log_id);


--
-- TOC entry 3509 (class 2606 OID 16422)
-- Name: asset asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_pkey PRIMARY KEY (asset_id);


--
-- TOC entry 3513 (class 2606 OID 16461)
-- Name: blacklist_tokens blacklist_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blacklist_tokens
    ADD CONSTRAINT blacklist_tokens_pkey PRIMARY KEY (id_blacklist_token);


--
-- TOC entry 3503 (class 2606 OID 16397)
-- Name: branch branch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch
    ADD CONSTRAINT branch_pkey PRIMARY KEY (branch_id);


--
-- TOC entry 3505 (class 2606 OID 16406)
-- Name: employee employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_pkey PRIMARY KEY (employee_id);


--
-- TOC entry 3515 (class 2606 OID 24582)
-- Name: tool_category tool_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool_category
    ADD CONSTRAINT tool_category_pkey PRIMARY KEY (tool_category_id);


--
-- TOC entry 3517 (class 2606 OID 24589)
-- Name: tool_condition tool_condition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool_condition
    ADD CONSTRAINT tool_condition_pkey PRIMARY KEY (tool_condition_id);


--
-- TOC entry 3519 (class 2606 OID 24596)
-- Name: unit unit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT unit_pkey PRIMARY KEY (unit_id);


--
-- TOC entry 3507 (class 2606 OID 16413)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3522 (class 2606 OID 24712)
-- Name: asset asset_fk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_fk_1 FOREIGN KEY (branch_id) REFERENCES public.branch(branch_id) NOT VALID;


--
-- TOC entry 3523 (class 2606 OID 24727)
-- Name: asset_change_log fk_asset_change1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_change_log
    ADD CONSTRAINT fk_asset_change1 FOREIGN KEY (asset_id) REFERENCES public.asset(asset_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3520 (class 2606 OID 24722)
-- Name: employee fk_employee1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT fk_employee1 FOREIGN KEY (branch_id) REFERENCES public.branch(branch_id) NOT VALID;


--
-- TOC entry 3521 (class 2606 OID 24732)
-- Name: user fk_user1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT fk_user1 FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id) NOT VALID;


-- Completed on 2024-12-10 10:23:22 WIB

--
-- PostgreSQL database dump complete
--

