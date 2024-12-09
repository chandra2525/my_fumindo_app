--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6
-- Dumped by pg_dump version 17.2

-- Started on 2024-12-09 13:11:02 WIB

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
-- TOC entry 224 (class 1259 OID 16448)
-- Name: asset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset (
    asset_id integer NOT NULL,
    branch_id smallint NOT NULL,
    asset_name character varying(100) NOT NULL,
    category character varying(10) NOT NULL,
    tool_condition character varying(15),
    unit character varying(15),
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
-- TOC entry 223 (class 1259 OID 16447)
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
-- TOC entry 3685 (class 0 OID 0)
-- Dependencies: 223
-- Name: asset_asset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_asset_id_seq OWNED BY public.asset.asset_id;


--
-- TOC entry 222 (class 1259 OID 16437)
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
-- TOC entry 221 (class 1259 OID 16436)
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
-- TOC entry 3686 (class 0 OID 0)
-- Dependencies: 221
-- Name: asset_change_log_asset_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asset_change_log_asset_log_id_seq OWNED BY public.asset_change_log.asset_log_id;


--
-- TOC entry 226 (class 1259 OID 16457)
-- Name: blacklist_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blacklist_tokens (
    id_blacklist_token integer NOT NULL,
    token text,
    expired_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.blacklist_tokens OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16456)
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
-- TOC entry 3687 (class 0 OID 0)
-- Dependencies: 225
-- Name: blacklist_tokens_id_blacklist_token_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blacklist_tokens_id_blacklist_token_seq OWNED BY public.blacklist_tokens.id_blacklist_token;


--
-- TOC entry 216 (class 1259 OID 16403)
-- Name: branch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branch (
    branch_id integer NOT NULL,
    branch_name character varying(100) NOT NULL,
    address text NOT NULL
);


ALTER TABLE public.branch OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16402)
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
-- TOC entry 3688 (class 0 OID 0)
-- Dependencies: 215
-- Name: branch_branch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branch_branch_id_seq OWNED BY public.branch.branch_id;


--
-- TOC entry 220 (class 1259 OID 16421)
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
-- TOC entry 219 (class 1259 OID 16420)
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
-- TOC entry 3689 (class 0 OID 0)
-- Dependencies: 219
-- Name: employee_employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_employee_id_seq OWNED BY public.employee.employee_id;


--
-- TOC entry 228 (class 1259 OID 16468)
-- Name: tool_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tool_category (
    tool_category_id integer NOT NULL,
    tool_category_name character varying(50) NOT NULL
);


ALTER TABLE public.tool_category OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16467)
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
-- TOC entry 3690 (class 0 OID 0)
-- Dependencies: 227
-- Name: tool_category_tool_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tool_category_tool_category_id_seq OWNED BY public.tool_category.tool_category_id;


--
-- TOC entry 230 (class 1259 OID 16475)
-- Name: tool_condition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tool_condition (
    tool_condition_id integer NOT NULL,
    tool_condition_name character varying(30) NOT NULL
);


ALTER TABLE public.tool_condition OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16474)
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
-- TOC entry 3691 (class 0 OID 0)
-- Dependencies: 229
-- Name: tool_condition_tool_condition_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tool_condition_tool_condition_id_seq OWNED BY public.tool_condition.tool_condition_id;


--
-- TOC entry 232 (class 1259 OID 16482)
-- Name: unit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit (
    unit_id integer NOT NULL,
    unit_name character varying(15) NOT NULL
);


ALTER TABLE public.unit OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16481)
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
-- TOC entry 3692 (class 0 OID 0)
-- Dependencies: 231
-- Name: unit_unit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unit_unit_id_seq OWNED BY public.unit.unit_id;


--
-- TOC entry 218 (class 1259 OID 16412)
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
-- TOC entry 217 (class 1259 OID 16411)
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
-- TOC entry 3693 (class 0 OID 0)
-- Dependencies: 217
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_user_id_seq OWNED BY public."user".user_id;


--
-- TOC entry 3488 (class 2604 OID 16451)
-- Name: asset asset_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset ALTER COLUMN asset_id SET DEFAULT nextval('public.asset_asset_id_seq'::regclass);


--
-- TOC entry 3486 (class 2604 OID 16440)
-- Name: asset_change_log asset_log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_change_log ALTER COLUMN asset_log_id SET DEFAULT nextval('public.asset_change_log_asset_log_id_seq'::regclass);


--
-- TOC entry 3491 (class 2604 OID 16460)
-- Name: blacklist_tokens id_blacklist_token; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blacklist_tokens ALTER COLUMN id_blacklist_token SET DEFAULT nextval('public.blacklist_tokens_id_blacklist_token_seq'::regclass);


--
-- TOC entry 3483 (class 2604 OID 16406)
-- Name: branch branch_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch ALTER COLUMN branch_id SET DEFAULT nextval('public.branch_branch_id_seq'::regclass);


--
-- TOC entry 3485 (class 2604 OID 16424)
-- Name: employee employee_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee ALTER COLUMN employee_id SET DEFAULT nextval('public.employee_employee_id_seq'::regclass);


--
-- TOC entry 3494 (class 2604 OID 16471)
-- Name: tool_category tool_category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool_category ALTER COLUMN tool_category_id SET DEFAULT nextval('public.tool_category_tool_category_id_seq'::regclass);


--
-- TOC entry 3495 (class 2604 OID 16478)
-- Name: tool_condition tool_condition_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool_condition ALTER COLUMN tool_condition_id SET DEFAULT nextval('public.tool_condition_tool_condition_id_seq'::regclass);


--
-- TOC entry 3496 (class 2604 OID 16485)
-- Name: unit unit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit ALTER COLUMN unit_id SET DEFAULT nextval('public.unit_unit_id_seq'::regclass);


--
-- TOC entry 3484 (class 2604 OID 16415)
-- Name: user user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN user_id SET DEFAULT nextval('public.user_user_id_seq'::regclass);


--
-- TOC entry 3671 (class 0 OID 16448)
-- Dependencies: 224
-- Data for Name: asset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset (asset_id, branch_id, asset_name, category, tool_condition, unit, initial_stock, current_stock, created_at, updated_at, tool_category_id, tool_condition_id, unit_id) FROM stdin;
17	3	BLOWER KRISBOW + BELALAI	Alat	Cukup	UNIT	4	3	2024-12-02 17:11:18.225283+07	2024-12-02 17:11:18.225283+07	40	7	14
15	4	BESTRIN FORTE 100 ECE	Bahan	\N	L	13	10	2024-11-29 09:19:44.685233+07	2024-11-29 09:19:44.685233+07	38	0	12
14	4	RODEX 0,005 BB	Bahan	\N	GRAM	10	8	2024-11-29 09:19:14.636593+07	2024-11-29 09:19:14.636593+07	38	0	10
13	4	RATGONE 0,005 BB	Bahan	\N	GRAM	11	9	2024-11-29 09:18:53.411271+07	2024-11-29 09:18:53.411271+07	40	0	10
12	4	SARUNG TANGAN KATUN	Bahan	\N	PCS	16	13	2024-11-29 09:17:59.283976+07	2024-11-29 09:17:59.283976+07	40	0	13
11	4	SULFURYL FLOURIDE	Bahan	\N	TABUNG	8	8	2024-11-29 09:17:29.385507+07	2024-11-29 09:17:29.385507+07	38	0	14
10	3	PHOSPHIN/ PH3 (KINGPHOST)	Bahan	\N	KG	20	18	2024-11-29 09:17:10.105979+07	2024-11-29 09:17:10.105979+07	38	0	12
9	3	METHYL BROMIDE	Bahan	\N	TABUNG	10	8	2024-11-29 09:16:43.847454+07	2024-11-29 09:16:43.847454+07	38	0	12
8	3	FOGGING TASCO KN 150	Alat	Baik	UNIT	3	2	2024-11-29 09:15:14.554919+07	2024-11-29 09:15:14.554919+07	40	7	14
7	4	LASER DISTANCE METER	Alat	Baik	UNIT	3	3	2024-11-29 09:14:47.90732+07	2024-11-29 09:14:47.90732+07	39	6	14
6	3	INTERFEROMETER RIKEN KEIKI F 121 SERI: 398030008YS	Alat	Rusak	UNIT	3	2	2024-11-29 09:14:10.265692+07	2024-11-29 09:14:10.265692+07	39	7	14
5	4	TANGGA TELESCOPIK 2M	Alat	Baik	UNIT	4	4	2024-11-29 09:13:31.61929+07	2024-11-29 09:13:31.61929+07	38	6	14
4	3	SCBA	Alat	Baik	UNIT	2	2	2024-11-29 09:13:06.273935+07	2024-11-29 09:13:06.273935+07	40	2	14
3	4	BLOWER KRISBOW + BELALAI	Alat	Baik	UNIT	4	3	2024-11-29 09:11:57.229824+07	2024-11-29 09:11:57.229824+07	38	1	14
16	4	SCBA FMS	Alat	Baik	UNIT	3	2	2024-11-29 09:31:28.425234+07	2024-11-29 09:31:28.425234+07	38	7	14
\.


--
-- TOC entry 3669 (class 0 OID 16437)
-- Dependencies: 222
-- Data for Name: asset_change_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_change_log (asset_log_id, asset_id, user_id, column_name, value_before, value_after, operation, created_at) FROM stdin;
215	15	3	asset_name	BESTRIN FORTE 100 EC	BESTRIN FORTE 100 ECE	Edit	2024-12-04 16:07:25.935781+07
219	5	3	tool_category_id	\N	38	Edit	2024-12-04 16:08:37.115833+07
221	7	3	tool_category_id	\N	39	Edit	2024-12-04 16:08:48.534388+07
224	8	3	tool_category_id	\N	40	Edit	2024-12-04 16:09:25.149492+07
235	16	3	tool_category_id	0	38	Edit	2024-12-04 16:13:24.87217+07
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
56	8	\N	asset_id	8	\N	Tambah	2024-11-29 09:15:14.576678+07
57	8	\N	branch_id	3	3	Tambah	2024-11-29 09:15:14.57815+07
58	8	\N	asset_name	Coba Alat	Coba Alat	Tambah	2024-11-29 09:15:14.579077+07
59	8	\N	category	Bahan	Bahan	Tambah	2024-11-29 09:15:14.580047+07
60	8	\N	tool_category	\N	\N	Tambah	2024-11-29 09:15:14.583719+07
61	8	\N	tool_condition	\N	\N	Tambah	2024-11-29 09:15:14.589943+07
62	8	\N	unit	PCS	PCS	Tambah	2024-11-29 09:15:14.594325+07
63	8	\N	initial_stock	3	3	Tambah	2024-11-29 09:15:14.595781+07
64	8	\N	current_stock	3	3	Tambah	2024-11-29 09:15:14.597035+07
65	8	\N	asset_name	Coba Alat	FOGGING TASCO KN 150	Edit	2024-11-29 09:15:31.638253+07
66	8	\N	category	Bahan	Alat	Edit	2024-11-29 09:15:31.651231+07
67	8	\N	tool_category	\N	Peralatan Pest Control	Edit	2024-11-29 09:15:31.652905+07
68	8	\N	tool_condition	\N	Baik	Edit	2024-11-29 09:15:31.655594+07
69	8	\N	unit	PCS	UNIT	Edit	2024-11-29 09:15:31.656616+07
70	8	\N	current_stock	3	2	Edit	2024-11-29 09:15:31.657235+07
71	9	\N	asset_id	9	\N	Tambah	2024-11-29 09:16:43.855329+07
72	9	\N	branch_id	3	3	Tambah	2024-11-29 09:16:43.857136+07
73	9	\N	asset_name	METHYL BROMIDE	METHYL BROMIDE	Tambah	2024-11-29 09:16:43.858533+07
74	9	\N	category	Bahan	Bahan	Tambah	2024-11-29 09:16:43.86061+07
75	9	\N	tool_category	\N	\N	Tambah	2024-11-29 09:16:43.862901+07
76	9	\N	tool_condition	\N	\N	Tambah	2024-11-29 09:16:43.864481+07
77	9	\N	unit	TABUNG	TABUNG	Tambah	2024-11-29 09:16:43.87823+07
78	9	\N	initial_stock	10	10	Tambah	2024-11-29 09:16:43.880706+07
79	9	\N	current_stock	8	8	Tambah	2024-11-29 09:16:43.882152+07
80	10	\N	asset_id	10	\N	Tambah	2024-11-29 09:17:10.11228+07
81	10	\N	branch_id	3	3	Tambah	2024-11-29 09:17:10.114563+07
82	10	\N	asset_name	PHOSPHIN/ PH3 (KINGPHOST)	PHOSPHIN/ PH3 (KINGPHOST)	Tambah	2024-11-29 09:17:10.12948+07
83	10	\N	category	Bahan	Bahan	Tambah	2024-11-29 09:17:10.18946+07
84	10	\N	tool_category	\N	\N	Tambah	2024-11-29 09:17:10.194049+07
85	10	\N	tool_condition	\N	\N	Tambah	2024-11-29 09:17:10.195321+07
86	10	\N	unit	KG	KG	Tambah	2024-11-29 09:17:10.196487+07
87	10	\N	initial_stock	20	20	Tambah	2024-11-29 09:17:10.19754+07
88	10	\N	current_stock	16	16	Tambah	2024-11-29 09:17:10.200664+07
\.


--
-- TOC entry 3673 (class 0 OID 16457)
-- Dependencies: 226
-- Data for Name: blacklist_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blacklist_tokens (id_blacklist_token, token, expired_at, created_at) FROM stdin;
11	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoYW5kcmEyNTI1Iiwic3ViIjoxLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3MzMzNjA4ODgsImV4cCI6MTczMzQ0NzI4OH0.3GTY6yH83OM-sF80oIJwX9HLZO4OH7I_BE9mUJ29h3g	2024-12-06 08:47:51.457+07	2024-12-05 08:47:51.458+07
\.


--
-- TOC entry 3663 (class 0 OID 16403)
-- Dependencies: 216
-- Data for Name: branch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branch (branch_id, branch_name, address) FROM stdin;
4	Fumindo Karawang	Jl.Raya Kopel Kp. Kelapa Nunggal RT. 027 RW. 007 Desa Gintung Kerta, Karawang, 41371\\nJawa Barat - Indonesia
3	Fumindo Surabaya	Jl. Margomulyo 51 A, No. 41, Greges, Kec. Asemrowo, Surabaya, 60183\\nJawa Timur - Indonesia
\.


--
-- TOC entry 3667 (class 0 OID 16421)
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
-- TOC entry 3675 (class 0 OID 16468)
-- Dependencies: 228
-- Data for Name: tool_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tool_category (tool_category_id, tool_category_name) FROM stdin;
39	Alat Ukur Fumigasi
41	Plastic Sheet
40	Pest Control
38	Fumigasi
\.


--
-- TOC entry 3677 (class 0 OID 16475)
-- Dependencies: 230
-- Data for Name: tool_condition; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tool_condition (tool_condition_id, tool_condition_name) FROM stdin;
1	Rusak
2	Kurang
6	Cukup
7	Baik
\.


--
-- TOC entry 3679 (class 0 OID 16482)
-- Dependencies: 232
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
-- TOC entry 3665 (class 0 OID 16412)
-- Dependencies: 218
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
\.


--
-- TOC entry 3694 (class 0 OID 0)
-- Dependencies: 223
-- Name: asset_asset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_asset_id_seq', 1, false);


--
-- TOC entry 3695 (class 0 OID 0)
-- Dependencies: 221
-- Name: asset_change_log_asset_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_change_log_asset_log_id_seq', 1, false);


--
-- TOC entry 3696 (class 0 OID 0)
-- Dependencies: 225
-- Name: blacklist_tokens_id_blacklist_token_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blacklist_tokens_id_blacklist_token_seq', 1, false);


--
-- TOC entry 3697 (class 0 OID 0)
-- Dependencies: 215
-- Name: branch_branch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branch_branch_id_seq', 1, false);


--
-- TOC entry 3698 (class 0 OID 0)
-- Dependencies: 219
-- Name: employee_employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_employee_id_seq', 1, false);


--
-- TOC entry 3699 (class 0 OID 0)
-- Dependencies: 227
-- Name: tool_category_tool_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tool_category_tool_category_id_seq', 1, false);


--
-- TOC entry 3700 (class 0 OID 0)
-- Dependencies: 229
-- Name: tool_condition_tool_condition_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tool_condition_tool_condition_id_seq', 1, false);


--
-- TOC entry 3701 (class 0 OID 0)
-- Dependencies: 231
-- Name: unit_unit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unit_unit_id_seq', 1, false);


--
-- TOC entry 3702 (class 0 OID 0)
-- Dependencies: 217
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_user_id_seq', 1, true);


--
-- TOC entry 3504 (class 2606 OID 16445)
-- Name: asset_change_log asset_change_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_change_log
    ADD CONSTRAINT asset_change_log_pkey PRIMARY KEY (asset_log_id);


--
-- TOC entry 3506 (class 2606 OID 16455)
-- Name: asset asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_pkey PRIMARY KEY (asset_id);


--
-- TOC entry 3508 (class 2606 OID 16466)
-- Name: blacklist_tokens blacklist_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blacklist_tokens
    ADD CONSTRAINT blacklist_tokens_pkey PRIMARY KEY (id_blacklist_token);


--
-- TOC entry 3498 (class 2606 OID 16410)
-- Name: branch branch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch
    ADD CONSTRAINT branch_pkey PRIMARY KEY (branch_id);


--
-- TOC entry 3502 (class 2606 OID 16428)
-- Name: employee employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_pkey PRIMARY KEY (employee_id);


--
-- TOC entry 3510 (class 2606 OID 16473)
-- Name: tool_category tool_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool_category
    ADD CONSTRAINT tool_category_pkey PRIMARY KEY (tool_category_id);


--
-- TOC entry 3512 (class 2606 OID 16480)
-- Name: tool_condition tool_condition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool_condition
    ADD CONSTRAINT tool_condition_pkey PRIMARY KEY (tool_condition_id);


--
-- TOC entry 3514 (class 2606 OID 16487)
-- Name: unit unit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT unit_pkey PRIMARY KEY (unit_id);


--
-- TOC entry 3500 (class 2606 OID 16419)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3518 (class 2606 OID 16488)
-- Name: asset asset_fk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_fk_1 FOREIGN KEY (branch_id) REFERENCES public.branch(branch_id) NOT VALID;


--
-- TOC entry 3517 (class 2606 OID 16493)
-- Name: asset_change_log fk_asset_change1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_change_log
    ADD CONSTRAINT fk_asset_change1 FOREIGN KEY (asset_id) REFERENCES public.asset(asset_id) NOT VALID;


--
-- TOC entry 3516 (class 2606 OID 16498)
-- Name: employee fk_employee1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT fk_employee1 FOREIGN KEY (branch_id) REFERENCES public.branch(branch_id) NOT VALID;


--
-- TOC entry 3515 (class 2606 OID 16503)
-- Name: user fk_user1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT fk_user1 FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id) NOT VALID;


-- Completed on 2024-12-09 13:11:04 WIB

--
-- PostgreSQL database dump complete
--

